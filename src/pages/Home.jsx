import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, TrendingUp, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { nervousSystemConfig } from '@/components/neuro/StateCard';
import HomeDrawer from '@/components/HomeDrawer';
import { useUser } from '@clerk/clerk-react';

const stateGradients = {
  regulado: 'from-emerald-50 to-background',
  activado: 'from-amber-50 to-background',
  colapsado: 'from-rose-50 to-background',
};

// Last emotional checkin from localStorage
function getLastEmotionalCheckin() {
  try {
    const checkins = JSON.parse(localStorage.getItem('neura_emotional_checkins') || '[]');
    return checkins[0] || null;
  } catch { return null; }
}

export default function Home() {
  const { user: clerkUser } = useUser();
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [recentLessons, setRecentLessons] = useState([]);
  const [checkInCount, setCheckInCount] = useState(0);
  const [lastEmotional, setLastEmotional] = useState(null);

  const firstName = clerkUser?.firstName || clerkUser?.fullName?.split(' ')[0] || '';
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  useEffect(() => {
    if (userEmail) {
      base44.entities.CheckIn.filter({ user_email: userEmail }, '-created_date', 1)
        .then(r => { if (r.length) { setLastCheckIn(r[0]); setCheckInCount(r.length); } });
      base44.entities.NeuroLesson.filter({ is_published: true }, '-created_date', 3)
        .then(setRecentLessons);
    }
    setLastEmotional(getLastEmotionalCheckin());
  }, [userEmail]);

  const ns = lastCheckIn ? nervousSystemConfig[lastCheckIn.nervous_system] : null;
  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`px-6 pt-12 pb-8 bg-gradient-to-b ${ns ? stateGradients[lastCheckIn.nervous_system] : 'from-secondary to-background'}`}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-xs text-muted-foreground capitalize tracking-wide">{today}</p>
              <h1 className="text-2xl font-serif mt-1 text-foreground">
                {firstName ? `Hola, ${firstName}` : 'Bienvenido a NEURA'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Entrená tu sistema nervioso</p>
            </div>
            <HomeDrawer />
          </div>
        </motion.div>
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
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${ns.dot}`} />
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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: lastEmotional ? `${lastEmotional.emotion_color}22` : '#F4C43022' }}>
              <span style={{ fontSize: '24px' }}>
                {lastEmotional ? lastEmotional.emotion_emoji : '🎡'}
              </span>
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
                <Link key={lesson.id} to={`/aprender/${lesson.id}`}
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
