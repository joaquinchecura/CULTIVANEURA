import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  { value: 'sistema_nervioso', label: '⚡ Sist. Nervioso',  Component: SistemaNerviosoSection },
  { value: 'emociones',        label: '❤️ Emociones',       Component: EmocionesSection },
  { value: 'habitos',          label: '🔄 Hábitos',         Component: HabitosSection },
  { value: 'recuperacion',     label: '😴 Recuperación',    Component: RecuperacionSection },
  { value: 'rendimiento',      label: '🎯 Rendimiento',     Component: RendimientoSection },
  { value: 'respiracion',      label: '🌬️ Respiración',    Component: RespiracionSection },
  { value: 'neurociencia',     label: '🧠 Neurociencia',    Component: null }, // own nav
  { value: 'neuroplasticidad', label: '🔬 Ejercicio & SN',  Component: NeuroplasticidadSection },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Aprender() {
  const [category, setCategory] = useState('sistema_nervioso');
  const activeTab = TABS.find(t => t.value === category);

  return (
    <div className="pb-8">

      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
          Biblioteca
        </p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Aprender</h1>
        <p className="text-sm text-muted-foreground mt-1">Neurociencia aplicada a tu vida</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-6 mb-2 no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
              category === tab.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            {tab.label}
          </button>
        ))}
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