import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, TrendingUp, BookOpen, Heart, ShieldCheck, AlertCircle, BatteryLow, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NS_CONFIG } from '@/lib/nervous-system';
import { LS_KEYS, lsGet } from '@/lib/storage';
import HomeDrawer from '@/components/HomeDrawer';
import { useUser } from '@clerk/clerk-react';
import heroBg from '@/assets/hero.jpg';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/use-theme';

function getLastEmotionalCheckin(userEmail) {
  try {
    const checkins = lsGet(LS_KEYS.EMOTIONAL)
      .filter(c => !userEmail || !c.user_email || c.user_email === userEmail)
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return checkins[0] || null;
  } catch { return null; }
}

// Mapeo de íconos según el estado
const stateIcons = {
  regulado: ShieldCheck,
  activado: AlertCircle,
  colapsado: BatteryLow,
};

export default function Home() {
  const { user: clerkUser } = useUser();
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [recentLessons, setRecentLessons] = useState([]);
  const [checkInCount, setCheckInCount] = useState(0);
  const [lastEmotional, setLastEmotional] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const firstName = clerkUser?.firstName || clerkUser?.fullName?.split(' ')[0] || '';
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  useEffect(() => {
    if (!userEmail) return;

    // Check-ins del sistema nervioso
    const checkins = lsGet(LS_KEYS.CHECKINS)
      .filter(c => c.user_email === userEmail)
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    setLastCheckIn(checkins[0] ?? null);
    setCheckInCount(checkins.length);

    // Último check-in emocional
    setLastEmotional(getLastEmotionalCheckin(userEmail));

    // Lecciones recientes
    const lessons = lsGet(LS_KEYS.LESSONS)
      .filter(l => l.is_published)
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 3);
    setRecentLessons(lessons);
  }, [userEmail]);

  const ns = lastCheckIn ? NS_CONFIG[lastCheckIn.nervous_system] : null;
  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Lógica para el ícono de estado
  const StateIcon = lastCheckIn ? stateIcons[lastCheckIn.nervous_system] || ShieldCheck : ShieldCheck;
  const stateColorClass = lastCheckIn?.nervous_system === 'regulado' ? 'bg-emerald-100 text-emerald-700' :
                          lastCheckIn?.nervous_system === 'activado' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700';

  return (
    <div className="min-h-screen">
      {/* Header */}
<div className={`relative overflow-hidden px-6 pt-12 pb-8 bg-gradient-to-b ${ns ? ns.gradient : 'from-secondary to-background'}`}>
  {/* Imagen de fondo */}
  <img
    src={heroBg}
    alt=""
    className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
    /* 👆 Subimos de 0.07 a 30 */
  />
  
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
    <div className="flex items-start justify-between mb-1">
      <div>
        <p className="text-xs text-muted-foreground capitalize tracking-wide">{today}</p>
        <h1 className="text-2xl font-serif mt-1 text-foreground">
          {firstName ? `Hola, ${firstName}` : 'Bienvenido a NEURA'}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Entrená tu sistema nervioso</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-card/50 border border-border flex items-center justify-center text-foreground backdrop-blur-sm hover:bg-card transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <HomeDrawer />
      </div>
    </div>
  </motion.div> {/* 👈 ESTE CIERRE FALTABA */}
</div>

      <div className="px-6 space-y-5 pb-8">

        {/* Estado actual SN */}
        {lastCheckIn && ns ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Estado actual</span>
              <Link to="/estado" className="text-xs text-primary font-medium">Actualizar →</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stateColorClass}`}>
                <StateIcon size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{ns.label}</p>
                <p className="text-xs text-muted-foreground">{ns.desc}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-3xl p-5">
            <p className="text-sm font-medium text-foreground mb-1">¿Cómo está tu sistema nervioso?</p>
            <p className="text-xs text-muted-foreground mb-3">Hacé tu primer check-in del día</p>
            <Button asChild size="sm" className="gap-1 rounded-xl">
              <Link to="/estado"><Zap size={14} /> Iniciar check-in</Link>
            </Button>
          </motion.div>
        )}

        {/* Rueda Emocional card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}>
          <Link to="/rueda-emocional"
            className="flex items-center gap-4 bg-card border border-border rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/10">
              {lastEmotional ? (
                <span className="text-xl">{lastEmotional.emotion_emoji}</span>
              ) : (
                <Smile size={22} className="text-primary" strokeWidth={2} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Rueda Emocional</p>
              {lastEmotional ? (
                <p className="text-xs text-muted-foreground">
                  Último: <span className="font-medium">{lastEmotional.emotion_name}</span> · {lastEmotional.intensity_label}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Registrá cómo te sentís ahora</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-rose-400" />
              <ArrowRight size={14} className="text-muted-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* Acción rápida */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
          <h2 className="text-base font-serif text-foreground mb-3">Acción rápida</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/regular" className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
              <Zap size={20} className="text-primary mb-2" />
              <p className="text-sm font-semibold text-foreground">Regular</p>
              <p className="text-xs text-muted-foreground">Técnicas ahora</p>
            </Link>
            <Link to="/aprender" className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
              <BookOpen size={20} className="text-primary mb-2" />
              <p className="text-sm font-semibold text-foreground">Aprender</p>
              <p className="text-xs text-muted-foreground">Neuro lecciones</p>
            </Link>
          </div>
        </motion.div>

        {/* Progreso */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }}
          className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Progreso neurofisiológico</span>
            <Link to="/progreso"><TrendingUp size={16} className="text-primary" /></Link>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Check-ins realizados: <strong>{checkInCount}</strong></p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((checkInCount / 30) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{checkInCount}/30 para el primer hito</p>
        </motion.div>

        {/* Lecciones recientes */}
        {recentLessons.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-serif">Lecciones</h2>
              <Link to="/aprender" className="text-xs text-primary font-medium">Ver todas →</Link>
            </div>
            <div className="space-y-3">
              {recentLessons.map(lesson => (
                <Link key={lesson.id} to={`/aprender?lesson=${lesson.id}`}
                  className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 hover:shadow-sm transition-shadow">
                  {lesson.cover_image_url
                    ? <img src={lesson.cover_image_url} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt="" />
                    : <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><BookOpen size={20} className="text-primary/50" /></div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{lesson.summary}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}