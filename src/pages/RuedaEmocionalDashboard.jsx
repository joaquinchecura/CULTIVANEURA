import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { EMOTIONS, EMOTIONS_MAP } from '@/components/emotionalwheel/emotions';

const DIAS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

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
    alegria: '¡Tu semana fue muy positiva! ¿Qué estuviste haciendo diferente? ✨',
    enojo: 'Sentiste mucho enojo esta semana. ¿Hay algo que necesites expresar o cambiar? 💬',
    miedo: 'La ansiedad fue predominante. Considerá practicar técnicas de regulación 🫁',
    tristeza: 'Hubo tristeza frecuente. Recordá ser compasivo con vos mismo 💙',
    confianza: 'Te sentiste muy seguro esta semana. ¡Buen momento para nuevos desafíos! 🎯',
    anticipacion: 'Mucha energía anticipatoria. Canalizala en acciones concretas 🚀',
    disgusto: 'El disgusto señala tus valores. Revisá qué límites necesitás establecer 🛑',
    sorpresa: 'Mucha sorpresa esta semana. Tomáte tiempo para procesar los cambios 🌊',
  };
  return insights[dominantId] || 'Estás experimentando una variedad emocional saludable 🌈';
}

export default function RuedaEmocionalDashboard() {
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState([]);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    setCheckins(getCheckins());
  }, []);

  const daysBack = period === 'week' ? 7 : 30;
  const cutoff = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');
  const recent = checkins.filter(c => c.date >= cutoff);

  // Radar data
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
    const dominant = dayCheckins[0];
    return {
      day: DIAS[d.getDay()],
      count: dayCheckins.length,
      color: dominant?.emotion_color || '#E9ECEF',
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
      {/* Header */}
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
                background: period === p.v ? 'var(--foreground)' : 'var(--card)',
                color: period === p.v ? 'var(--background)' : 'var(--muted-foreground)',
                borderColor: period === p.v ? 'transparent' : 'var(--border)',
              }}>
              {p.l}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: checkins.length, l: 'CHECK-INS' },
            { v: `${streak}🔥`, l: 'RACHA' },
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

        {/* Radar chart */}
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
