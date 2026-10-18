import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart2, Zap, BookOpen, TrendingUp, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useUser } from '@clerk/clerk-react';
import { generarPDFSemanal } from '@/lib/pdf';
import { LS_KEYS, lsGet, lsFilter } from '@/lib/storage'; // Usamos el storage unificado

// ─── Keys localStorage (deben coincidir con Estado.jsx y RuedaEmocional.jsx) ──

const LS_EMOCIONAL_KEY = 'neura_emotional_checkins'; // rueda emocional

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}

function lsFilter(key, filterObj = {}, limitN = 200) {
  let all = lsGet(key);
  Object.entries(filterObj).forEach(([k, v]) => {
    all = all.filter(item => item[k] === v);
  });
  all.sort((a, b) => new Date(b.created_date || b.created_at) - new Date(a.created_date || a.created_at));
  return all.slice(0, limitN);
}
// ─── Colors ──────────────────────────────────────────────────────────────────

const nsColors = {
  regulado: '#4ade80',
  activado:  '#fbbf24',
  colapsado: '#f87171',
};


// ─── Main component ───────────────────────────────────────────────────────────

const nsColorsMap = {
  regulado: '#4ade80',
  activado:  '#fbbf24',
  colapsado: '#f87171',
};

export default function Progreso() {
  const { user: clerkUser } = useUser();
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  const [checkIns,        setCheckIns]        = useState([]);
  const [sistemaCheckins, setSistemaCheckins] = useState([]);
  const [emocionales,     setEmocionales]     = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [pdfLoading,      setPdfLoading]      = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    const ci  = lsFilter(LS_KEYS.CHECKINS, { user_email: userEmail }, 200);
    const sis = lsFilter(LS_KEYS.SISTEMA,  { user_email: userEmail }, 200);
    const em  = lsGet(LS_KEYS.EMOTIONAL);
    setCheckIns(ci);
    setSistemaCheckins(sis);
    setEmocionales(em);
    setLoading(false);
  }, [userEmail]);
  

  // ── Derived stats ──────────────────────────────────────────────────────────

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const ds = format(d, 'yyyy-MM-dd');
    const ci = checkIns.find(c => c.date === ds);
    return {
      day:   format(d, 'EEE', { locale: es }),
      state: ci?.nervous_system || null,
      fill:  ci ? nsColorsMap[ci.nervous_system] || '#e5e7eb' : '#e5e7eb',
      value: ci ? 1 : 0,
    };
  });

  const nsCount = checkIns.reduce((acc, ci) => {
    acc[ci.nervous_system] = (acc[ci.nervous_system] || 0) + 1;
    return acc;
  }, {});
  const dominantState = Object.entries(nsCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  const emotionCount = emocionales.reduce((acc, e) => {
    acc[e.emotion_name] = (acc[e.emotion_name] || 0) + 1;
    return acc;
  }, {});
  const dominantEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];

  // Streak (días consecutivos con al menos un check-in)
  function calcStreak() {
    const dates = [...new Set([
      ...checkIns.map(c => c.date),
      ...sistemaCheckins.map(c => c.date),
    ])].filter(Boolean).sort().reverse();
    let streak = 0;
    let expected = format(new Date(), 'yyyy-MM-dd');
    for (const d of dates) {
      if (d === expected) {
        streak++;
        expected = format(subDays(parseISO(d + 'T12:00:00'), 1), 'yyyy-MM-dd');
      } else break;
    }
    return streak;
  }
  const streak = calcStreak();

  const statsCards = [
    { label: 'Check-ins SN',    value: checkIns.length,        icon: Zap,       color: 'text-primary' },
    { label: 'Estados Sistema', value: sistemaCheckins.length,  icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Reg. Emocional',  value: emocionales.length,      icon: BookOpen,   color: 'text-rose-500' },
    { label: 'Racha (días)',    value: streak,                  icon: BarChart2,  color: 'text-violet-600' },
  ];

  // ── PDF handler ────────────────────────────────────────────────────────────

  function handleExportPDF() {
    setPdfLoading(true);
    try {
      // Llamamos al NUEVO generador (el verde, de 1 página)
      generarPDFSemanal(checkIns, sistemaCheckins, userEmail);
    } catch (e) {
      console.error(e);
      alert('Error al generar el PDF. Revisá la consola.');
    } finally {
      setPdfLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 pt-12 pb-8">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Tu recorrido</p>
          <h1 className="text-2xl font-serif text-foreground mt-0.5">Progreso</h1>
          <p className="text-sm text-muted-foreground mt-1">Evolución de tu sistema nervioso</p>
        </div>

        {/* PDF button */}
        <button
          onClick={handleExportPDF}
          disabled={pdfLoading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
          title="Descargar reporte semanal completo"
        >
          <FileDown className="w-4 h-4" />
          {pdfLoading ? 'Generando...' : 'Reporte PDF'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-6">

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {statsCards.map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <Icon size={18} className={color} />
                <p className="text-2xl font-serif mt-2 text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Weekly SN chart */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">Últimos 7 días · Sistema Nervioso</h2>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={last7} barCategoryGap="20%">
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.length || !payload[0].payload.state) return null;
                    return (
                      <div className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs shadow-lg capitalize">
                        {payload[0].payload.state}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {last7.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-3 justify-center">
              {Object.entries(nsColorsMap).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v }} />
                  <span className="text-xs text-muted-foreground capitalize">{k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dominant NS state */}
          {dominantState && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Estado SN dominante</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nsColorsMap[dominantState] }} />
                <p className="font-semibold text-foreground capitalize">{dominantState}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {nsCount[dominantState]} de {checkIns.length} check-ins
              </p>
            </div>
          )}

          {/* Dominant emotion */}
          {dominantEmotion && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Emoción dominante</p>
              <p className="font-semibold text-foreground mt-1">{dominantEmotion[0]}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{dominantEmotion[1]} registros</p>
            </div>
          )}

          {/* Recent SN check-ins */}
          {checkIns.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-foreground mb-3">Historial · Check-ins SN</h2>
              <div className="space-y-2">
                {checkIns.slice(0, 10).map(ci => (
                  <div key={ci.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: nsColorsMap[ci.nervous_system] || '#d1d5db' }} />
                      <div>
                        <p className="text-sm capitalize text-foreground">{ci.nervous_system}</p>
                        <p className="text-xs text-muted-foreground capitalize">{ci.emotion} · {ci.mind}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {ci.date ? format(parseISO(ci.date + 'T00:00:00'), 'd MMM', { locale: es }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent emotional check-ins */}
          {emocionales.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-foreground mb-3">Historial · Rueda Emocional</h2>
              <div className="space-y-2">
                {emocionales.slice(0, 6).map((e, i) => (
                  <div key={i} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{e.emotion_emoji}</span>
                      <div>
                        <p className="text-sm text-foreground">{e.emotion_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.intensity_label}
                          {e.technique_name ? ` · ✓ ${e.technique_name}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {e.date ? format(parseISO(e.date + 'T00:00:00'), 'd MMM', { locale: es }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {checkIns.length === 0 && sistemaCheckins.length === 0 && emocionales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">Todavía no hay datos</p>
              <p className="text-xs text-muted-foreground mt-1">Hacé tu primer check-in para ver tu progreso</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
