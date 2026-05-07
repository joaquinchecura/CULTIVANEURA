import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { format, subDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart2, Zap, BookOpen, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const nsColors = {
  regulado: '#4ade80',
  activado: '#fbbf24',
  colapsado: '#f87171',
};

export default function Progreso() {
  const [user, setUser] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) {
        Promise.all([
          base44.entities.CheckIn.filter({ user_email: u.email }, '-created_date', 30),
          base44.entities.UserProgress.filter({ user_email: u.email }, '-created_date', 50),
        ]).then(([ci, prog]) => {
          setCheckIns(ci);
          setProgress(prog);
          setLoading(false);
        });
      }
    });
  }, []);

  // Build last 7 days chart data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const ci = checkIns.find(c => c.date === dateStr);
    return {
      day: format(d, 'EEE', { locale: es }),
      state: ci?.nervous_system || null,
      fill: ci ? nsColors[ci.nervous_system] : '#e5e7eb',
      value: ci ? 1 : 0,
    };
  });

  const nsCount = checkIns.reduce((acc, ci) => {
    acc[ci.nervous_system] = (acc[ci.nervous_system] || 0) + 1;
    return acc;
  }, {});

  const dominantState = Object.entries(nsCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const lessonsCompleted = progress.filter(p => p.type === 'lesson').length;
  const interventionsCompleted = progress.filter(p => p.type === 'intervention').length;

  const statsCards = [
    { label: 'Check-ins totales', value: checkIns.length, icon: Zap, color: 'text-primary' },
    { label: 'Lecciones', value: lessonsCompleted, icon: BookOpen, color: 'text-emerald-600' },
    { label: 'Regulaciones', value: interventionsCompleted, icon: TrendingUp, color: 'text-amber-600' },
    { label: 'Racha (días)', value: checkIns.length > 0 ? Math.min(checkIns.length, 7) : 0, icon: BarChart2, color: 'text-violet-600' },
  ];

  return (
    <div className="px-6 pt-12 pb-8">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Tu recorrido</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Progreso</h1>
        <p className="text-sm text-muted-foreground mt-1">Evolución de tu sistema nervioso</p>
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

          {/* Weekly chart */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="text-sm font-medium text-foreground mb-4">Últimos 7 días</h2>
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
                  {last7.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-3 justify-center">
              {Object.entries(nsColors).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v }} />
                  <span className="text-xs text-muted-foreground capitalize">{k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dominant state */}
          {dominantState && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Estado dominante</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nsColors[dominantState] }} />
                <p className="font-semibold text-foreground capitalize">{dominantState}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {nsCount[dominantState]} de {checkIns.length} check-ins
              </p>
            </div>
          )}

          {/* Recent check-ins */}
          {checkIns.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-foreground mb-3">Historial completo</h2>
              <div className="space-y-2">
                {checkIns.slice(0, 10).map(ci => (
                  <div key={ci.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: nsColors[ci.nervous_system] || '#d1d5db' }} />
                      <div>
                        <p className="text-sm capitalize text-foreground">{ci.nervous_system}</p>
                        <p className="text-xs text-muted-foreground capitalize">{ci.emotion} · {ci.mind}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {ci.date ? format(parseISO(ci.date), 'd MMM', { locale: es }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkIns.length === 0 && (
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