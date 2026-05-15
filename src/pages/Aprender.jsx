import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LessonCard from '@/components/neuro/LessonCard';
import SistemanerviosoSection from '@/components/neuro/Sistemanerviososection';
import EmocionesSection from '@/components/neuro/Emocionessection';
import HabitosSecion from '@/components/neuro/HabitosSection';
import RecuperacionSection from '@/components/neuro/RecuperacionSection';
import NeurocienciaContent from '@/components/neuro/NeurocienciaContent';
import NeuroplasticidadSection from '@/components/neuro/NeuroplasticidadSection';
import { cn } from '@/lib/utils';

// ─── Tab definitions ───────────────────────────────────────────────────────────

const STATIC_CATEGORIES = [
  { value: 'sistema_nervioso', label: 'Sistema Nervioso' },
  { value: 'emociones',     label: 'Emociones' },
  { value: 'habitos',       label: 'Hábitos' },
  { value: 'recuperacion',  label: 'Recuperación' },
  { value: 'neurociencia',     label: 'Neurociencia' },
  { value: 'neuroplasticidad', label: 'Ejercicio y Cerebro' },
];

const ALL_CATEGORIES = [...DYNAMIC_CATEGORIES, ...STATIC_CATEGORIES];

// ─── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-muted rounded-2xl h-52 animate-pulse" />
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Aprender() {
  const [lessons, setLessons] = useState([]);
  const [category, setCategory] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NeuroLesson.filter({ is_published: true }, 'order')
      .then(data => { setLessons(data); setLoading(false); });
  }, []);

  const isStatic = STATIC_CATEGORIES.some(c => c.value === category);

  const filtered = lessons.filter(
    l => category === 'todos' || l.category === category
  );

  return (
    <div className="pb-8">
      {/* ── Page header ── */}
      <div className="px-6 pt-12 pb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Biblioteca</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Aprender</h1>
        <p className="text-sm text-muted-foreground mt-1">Neurociencia aplicada a tu vida</p>
      </div>

      {/* ── Category tab bar ── */}
      {/* Scrollable single row; static tabs get a subtle teal-tinted pill */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-6 -mx-0 mb-2 no-scrollbar">
        {ALL_CATEGORIES.map(cat => {
          const isStaticTab = STATIC_CATEGORIES.some(c => c.value === cat.value);
          const active = category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : isStaticTab
                    ? 'bg-[#264653]/10 text-[#264653] hover:bg-[#264653]/20'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Content area ── */}
      <AnimatePresence mode="wait">
        {/* ── STATIC: Neurociencia ── */}
        {category === 'neurociencia' && (
          <motion.div
            key="neurociencia"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/*
              NeurocienciaContent normally renders its own back button (onBack prop).
              Here we wire onBack to switch back to the 'todos' tab, so it feels
              native to the tab navigation rather than a separate screen.
            */}
            <NeurocienciaContent onBack={() => setCategory('todos')} />
          </motion.div>
        )}

        {/* ── STATIC: Neuroplasticidad ── */}
        {category === 'neuroplasticidad' && (
          <motion.div
            key="neuroplasticidad"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <NeuroplasticidadSection />
          </motion.div>
        )}

        {/* ── DYNAMIC: backend lessons ── */}
        {!isStatic && (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-6 pt-2"
          >
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {filtered.map((lesson, i) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <LessonCard lesson={lesson} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}