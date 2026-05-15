import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Brain, Activity, Zap, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, Tooltip, Cell,
  LineChart, Line, YAxis,
} from 'recharts';
import { EMOTIONS, EMOTIONS_MAP } from '@/components/emotionalwheel/emotions';
import { base44 } from '@/api/base44Client';
import { useUser } from '@clerk/clerk-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const DIAS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const EMOTION_LABELS = {
  joy: 'Alegría', sadness: 'Tristeza', anger: 'Enojo',
  frustration: 'Frustración', calm: 'Calma', anxiety: 'Ansiedad',
};
const EMOTION_EMOJIS = {
  joy: '😊', sadness: '😢', anger: '😠',
  frustration: '😤', calm: '😌', anxiety: '😰',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCheckins() {
  return JSON.parse(localStorage.getItem('neura_emotional_checkins') || '[]');
}

function getStreak(checkins) {
  const dates = [...new Set(checkins.map(c => c.date))].sort().reverse();
  let streak = 0;
  let expected = format(new Date(), 'yyyy-MM-dd');
  for (const d of dates) {
    if (d === expected) {
      streak++;
      expected = format(subDays(new Date(d + 'T12:00:00'), 1), 'yyyy-MM-dd');
    } else break;
  }
  return streak;
}

function getInsight(dominantId, recentCount) {
  if (recentCount < 3) return 'Seguí registrando tus emociones para descubrir patrones 🌱';
  const insights = {
    alegria:      '¡Tu semana fue muy positiva! ¿Qué estuviste haciendo diferente? ✨',
    enojo:        'Sentiste mucho enojo esta semana. ¿Hay algo que necesites expresar o cambiar? 💬',
    miedo:        'La ansiedad fue predominante. Considerá practicar técnicas de regulación 🫁',
    tristeza:     'Hubo tristeza frecuente. Recordá ser compasivo con vos mismo 💙',
    confianza:    'Te sentiste muy seguro esta semana. ¡Buen momento para nuevos desafíos! 🎯',
    anticipacion: 'Mucha energía anticipatoria. Canalizala en acciones concretas 🚀',
    disgusto:     'El disgusto señala tus valores. Revisá qué límites necesitás establecer 🛑',
    sorpresa:     'Mucha sorpresa esta semana. Tomáte tiempo para procesar los cambios 🌊',
  };
  return insights[dominantId] || 'Estás experimentando una variedad emocional saludable 🌈';
}

// ─── Bienestar sub-components ─────────────────────────────────────────────────

function WellnessScoreRing({ score }) {
  const color = score >= 70 ? '#2A9D8F' : score >= 45 ? '#E9C46A' : '#E07A5F';
  const label = score >= 70 ? 'Bienestar óptimo' : score >= 45 ? 'Bienestar moderado' : 'Necesita atención';
  const r = 44;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center py-2">
      <div style={{ position: 'relative', width: '110px', height: '110px' }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
          <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - score / 100)}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-2xl font-bold text-foreground">{Math.round(score)}</span>
          <span className="text-[10px] text-muted-foreground font-semibold">/100</span>
        </div>
      </div>
      <p className="text-sm font-bold mt-1.5" style={{ color }}>{label}</p>
    </div>
  );
}

function ScoreBar({ label, value, color, icon: Icon }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs font-bold text-foreground">{label}</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'var(--muted)' }}>
        <div
          className="rounded-full transition-all duration-700"
          style={{ width: `${Math.min(value, 100)}%`, height: '8px', background: color }}
        />
      </div>
    </div>
  );
}

/** The full BienestarEmocional panel, rendered inline inside the dashboard */
function BienestarPanel({ userEmail }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) { setLoading(false); return; }
    const since = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    base44.entities.DailySystemCheckin
      .filter({ date: { $gte: since } }, 'date', 30)
      .then(data => {
        setHistory(
          data
            .filter(d => d.wellness_score != null)
            .sort((a, b) => a.date > b.date ? 1 : -1)
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userEmail]);

  const latest = history[history.length - 1];

  // Weekly chart data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const entry = history.find(h => h.date === d);
    return {
      day: format(subDays(new Date(), 6 - i), 'dd/MM'),
      regulacion: entry?.regulation_score ?? null,
      estres:     entry?.stress_score ?? null,
      energia:    entry?.energy_score ?? null,
    };
  });

  // Dominant emotion
  const emotionCounts = {};
  history.forEach(h => {
    if (h.emotional_state) emotionCounts[h.emotional_state] = (emotionCounts[h.emotional_state] || 0) + 1;
  });
  const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Auto insights
  const insights = [];
  if (latest) {
    if (latest.stress_score > 70)    insights.push('Tu nivel de estrés está elevado. Priorizá caminatas, respiración y descanso.');
    if (latest.regulation_score > 70) insights.push('Tu sistema nervioso está bien regulado. Buen momento para entrenamientos intensos.');
    if (latest.energy_score < 30)    insights.push('Tu energía está baja. Intenta exponerte al sol, caminar y consumir comidas nutritivas.');
    if (insights.length === 0)        insights.push('Tu bienestar está en equilibrio. Seguí con tus hábitos actuales.');
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 rounded-full border-2 border-muted border-t-foreground animate-spin" />
    </div>
  );

  if (!latest) return (
    <div className="bg-card rounded-2xl border border-border p-8 text-center">
      <p className="text-3xl mb-3">🧠</p>
      <p className="text-sm font-bold text-foreground mb-1">Sin datos de bienestar aún</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Completá el check-in de Estado del Sistema para ver estos datos.
      </p>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Wellness score + bars in a single card */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Wellness Score · Hoy
        </p>
        <WellnessScoreRing score={latest.wellness_score} />

        <div className="border-t border-border pt-4 space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Dashboard diario
          </p>
          <ScoreBar label="Regulación SN"  value={latest.regulation_score} color="#2A9D8F" icon={Activity} />
          <ScoreBar label="Nivel de estrés" value={latest.stress_score}    color="#E07A5F" icon={Zap} />
          <ScoreBar label="Nivel de energía" value={latest.energy_score}   color="#E9C46A" icon={TrendingUp} />
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: '#264653' }}>
          <p className="text-xs font-bold mb-2" style={{ color: '#E9C46A', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            💡 Insights automáticos
          </p>
          {insights.map((ins, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>• {ins}</p>
          ))}
        </div>
      )}

      {/* Weekly line chart */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Evolución semanal
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={last7} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              contentStyle={{ background: '#264653', border: 'none', borderRadius: '12px', fontSize: '12px', color: 'white' }}
              labelStyle={{ color: '#E9C46A', fontWeight: 700 }}
            />
            <Line type="monotone" dataKey="regulacion" stroke="#2A9D8F" strokeWidth={2} dot={false} name="Regulación" connectNulls={false} />
            <Line type="monotone" dataKey="estres"     stroke="#E07A5F" strokeWidth={2} dot={false} name="Estrés"     connectNulls={false} />
            <Line type="monotone" dataKey="energia"    stroke="#E9C46A" strokeWidth={2} dot={false} name="Energía"    connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          {[['#2A9D8F', 'Regulación'], ['#E07A5F', 'Estrés'], ['#E9C46A', 'Energía']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              <span className="text-[11px] text-muted-foreground font-medium">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dominant emotion (last 7 days from SN checkins) */}
      {dominantEmotion && (
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <span style={{ fontSize: '36px' }}>{EMOTION_EMOJIS[dominantEmotion] || '🧠'}</span>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Emoción dominante · 7 días</p>
            <p className="text-base font-bold text-foreground mt-0.5">{EMOTION_LABELS[dominantEmotion] || dominantEmotion}</p>
            <p className="text-xs text-muted-foreground">
              {emotionCounts[dominantEmotion]} de {history.length} check-ins
            </p>
          </div>
        </div>
      )}

      {/* History list */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Historial de bienestar
        </p>
        <div className="space-y-1">
          {[...history].reverse().map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '20px' }}>{EMOTION_EMOJIS[entry.emotional_state] || '🧠'}</span>
                <div>
                  <p className="text-xs font-bold text-foreground">{entry.date}</p>
                  <p className="text-xs text-muted-foreground">{EMOTION_LABELS[entry.emotional_state] || '—'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{Math.round(entry.wellness_score)}</p>
                <p className="text-[10px] text-muted-foreground">wellness</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function RuedaEmocionalDashboard() {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  const [checkins, setCheckins] = useState([]);
  const [period, setPeriod] = useState('week');
  const [showBienestar, setShowBienestar] = useState(false);

  useEffect(() => {
    setCheckins(getCheckins());
  }, []);

  const daysBack = period === 'week' ? 7 : 30;
  const cutoff = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');
  const recent = checkins.filter(c => c.date >= cutoff);

  // Radar
  const radarData = EMOTIONS.map(e => ({
    name: e.emoji,
    emotion: e.name,
    value: recent.filter(c => c.emotion_id === e.id).length,
    color: e.color,
  }));

  // Bar chart last 7 days
  const barData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayCheckins = checkins.filter(c => c.date === dateStr);
    return {
      day: DIAS[d.getDay()],
      count: dayCheckins.length,
      color: dayCheckins[0]?.emotion_color || 'var(--muted)',
    };
  });

  // Dominant emotion
  const emotionCounts = {};
  recent.forEach(c => { emotionCounts[c.emotion_id] = (emotionCounts[c.emotion_id] || 0) + 1; });
  const dominantId = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const dominantEmotion = dominantId ? EMOTIONS_MAP[dominantId] : null;

  const streak = getStreak(checkins);
  const completedTechniques = checkins.filter(c => c.technique_id).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--app-bg)' }}>

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 flex items-center justify-between" style={{ height: '56px' }}>
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <p className="text-sm font-bold tracking-widest text-foreground">MI MAPA EMOCIONAL</p>
        <button onClick={() => navigate('/rueda-emocional')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted">
          <Plus className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">

        {/* Period toggle */}
        <div className="flex gap-2">
          {[{ v: 'week', l: 'Semana' }, { v: 'month', l: 'Mes' }].map(p => (
            <button key={p.v} onClick={() => setPeriod(p.v)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
              style={{
                background:   period === p.v ? 'var(--foreground)' : 'var(--card)',
                color:        period === p.v ? 'var(--background)' : 'var(--muted-foreground)',
                borderColor:  period === p.v ? 'transparent' : 'var(--border)',
              }}>
              {p.l}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: checkins.length, l: 'CHECK-INS' },
            { v: `${streak}🔥`,   l: 'RACHA' },
            { v: completedTechniques, l: 'TÉCNICAS' },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-2xl p-3 flex flex-col items-center border border-border">
              <span className="text-2xl font-bold text-foreground">{s.v}</span>
              <span className="text-[9px] font-bold text-muted-foreground tracking-widest mt-1">{s.l}</span>
            </div>
          ))}
        </div>

        {/* Dominant emotion */}
        {dominantEmotion && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${dominantEmotion.color}22` }}>
              {dominantEmotion.emoji}
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Emoción dominante</p>
              <p className="text-xl font-bold text-foreground">{dominantEmotion.name}</p>
              <p className="text-xs text-muted-foreground">{emotionCounts[dominantId]} registros este período</p>
            </div>
          </motion.div>
        )}

        {/* Radar */}
        {recent.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Distribución emocional</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} outerRadius={75}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 16 }} />
                <Radar dataKey="value" stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.12} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar chart */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Últimos 7 días</p>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={barData} barSize={20}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--card)', fontSize: '12px', color: 'var(--foreground)' }}
                formatter={(val) => [`${val} check-ins`, '']}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight */}
        <div className="rounded-2xl p-5 bg-foreground">
          <div className="flex items-center gap-2 mb-2">
            <span>💡</span>
            <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest">Insight</span>
          </div>
          <p className="text-sm text-white/90 leading-relaxed">{getInsight(dominantId, recent.length)}</p>
        </div>

        {/* ── Bienestar section toggle ────────────────────────────────────────
            Entry point to the full BienestarEmocional panel.
            Renders as an accordion so the user doesn't leave the dashboard.
        ──────────────────────────────────────────────────────────────────── */}
        <button
          onClick={() => setShowBienestar(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all"
          style={{
            background:  showBienestar ? '#264653' : 'var(--card)',
            borderColor: showBienestar ? '#264653'  : 'var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: showBienestar ? 'rgba(255,255,255,0.12)' : '#6B5B9518' }}
            >
              <Brain className="w-5 h-5" style={{ color: showBienestar ? '#E9C46A' : '#6B5B95' }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold" style={{ color: showBienestar ? 'white' : 'var(--foreground)' }}>
                Bienestar del sistema nervioso
              </p>
              <p className="text-xs" style={{ color: showBienestar ? 'rgba(255,255,255,0.65)' : 'var(--muted-foreground)' }}>
                Scores, evolución semanal e insights
              </p>
            </div>
          </div>
          {showBienestar
            ? <ChevronUp  className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }} />
            : <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          }
        </button>

        <AnimatePresence>
          {showBienestar && (
            <motion.div
              key="bienestar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <BienestarPanel userEmail={userEmail} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent history */}
        {recent.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Historial reciente</p>
            <div className="space-y-2">
              {recent.slice(0, 8).map((c, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${c.emotion_color}22` }}>
                    {c.emotion_emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{c.emotion_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.intensity_label} · {c.date}
                      {c.technique_name && ` · ${c.technique_name} ✓`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {checkins.length === 0 && (
          <div className="bg-card rounded-2xl p-8 text-center border border-border">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-lg font-bold text-foreground mb-2">Sin registros aún</p>
            <p className="text-sm text-muted-foreground mb-5">Hacé tu primer check-in emocional</p>
            <button onClick={() => navigate('/rueda-emocional')}
              className="px-6 py-3 rounded-2xl bg-foreground text-background text-sm font-bold">
              Comenzar
            </button>
          </div>
        )}

        {/* CTA */}
        {checkins.length > 0 && (
          <button onClick={() => navigate('/rueda-emocional')}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-foreground text-background text-sm font-bold">
            <Plus className="w-4 h-4" /> Nuevo Check-in
          </button>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}