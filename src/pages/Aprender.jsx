import { useState } from 'react';
import { Zap, Heart, RefreshCw, Moon, Target, Wind, Brain, Activity, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';

import SistemaNerviosoSection  from '@/components/neuro/SistemaNerviosoSection';
import EmocionesSection        from '@/components/neuro/EmocionesSection';
import HabitosSection          from '@/components/neuro/HabitosSection';
import RecuperacionSection     from '@/components/neuro/RecuperacionSection';
import RendimientoSection      from '@/components/neuro/RendimientoSection';
import RespiracionSection      from '@/components/neuro/RespiracionSection';
import NeurocienciaContent     from '@/components/neuro/NeurocienciaContent';
import NeuroplasticidadSection from '@/components/neuro/NeuroplasticidadSection';

// ─── Tabs ─────────────────────────────────────────────────────────────────────
// All static — no backend, no loading states.

const TABS = [
  { value: 'sistema_nervioso', label: 'Sist. Nervioso',  Component: SistemaNerviosoSection, icon: Zap },
  { value: 'emociones',        label: 'Emociones',       Component: EmocionesSection, icon: Heart },
  { value: 'habitos',          label: 'Hábitos',         Component: HabitosSection, icon: RefreshCw },
  { value: 'recuperacion',     label: 'Recuperación',    Component: RecuperacionSection, icon: Moon },
  { value: 'rendimiento',      label: 'Rendimiento',     Component: RendimientoSection, icon: Target },
  { value: 'respiracion',      label: 'Respiración',     Component: RespiracionSection, icon: Wind },
  { value: 'neurociencia',     label: 'Neurociencia',    Component: NeurocienciaContent, icon: Brain }, 
  { value: 'neuroplasticidad', label: 'Ejercicio & SN',  Component: NeuroplasticidadSection, icon: Activity },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Aprender() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson');
  const [category, setCategory] = useState('sistema_nervioso');
  const activeTab = TABS.find(t => t.value === category);

  return (
    <div className="pb-8">

{lessonId && (
  <div className="mx-6 mt-6 mb-2 p-5 rounded-3xl bg-primary/10 border border-primary/20 flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
      <BookOpen size={20} className="text-primary" />
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">Lección abierta desde tu progreso</p>
      <p className="text-xs text-muted-foreground mt-1">ID: {lessonId}. (El contenido detallado se está cargando...)</p>
    </div>
  </div>
)}

{/* Tab bar */}
<div className="flex flex-wrap gap-2 px-6 mb-4">
  {TABS.map(tab => {
    const Icon = tab.icon;
    return (
      <button
        key={tab.value}
        onClick={() => setCategory(tab.value)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all',
          category === tab.value
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-card border border-border text-muted-foreground hover:bg-muted'
        )}
      >
        <Icon size={16} strokeWidth={category === tab.value ? 2.5 : 2} />
        {tab.label}
      </button>
    );
  })}
</div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {category === 'neurociencia' ? (
            <NeurocienciaContent onBack={() => setCategory('sistema_nervioso')} />
          ) : activeTab?.Component ? (
            <activeTab.Component />
          ) : null}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}