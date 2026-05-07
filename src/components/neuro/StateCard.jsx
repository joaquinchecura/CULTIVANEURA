import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const stateConfig = {
  regulado: {
    color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Regulado',
    emoji: '🟢',
    desc: 'Tu sistema nervioso está en equilibrio'
  },
  activado: {
    color: 'bg-amber-100 border-amber-300 text-amber-800',
    dot: 'bg-amber-500',
    label: 'Activado',
    emoji: '🟡',
    desc: 'Alta activación, energía disponible'
  },
  colapsado: {
    color: 'bg-rose-100 border-rose-300 text-rose-800',
    dot: 'bg-rose-500',
    label: 'Colapsado',
    emoji: '🔴',
    desc: 'Necesitás regulación y calma'
  }
};

export const nervousSystemConfig = stateConfig;

export default function StateCard({ state, selected, onClick }) {
  const config = stateConfig[state];
  if (!config) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200',
        config.color,
        selected ? 'border-current shadow-md scale-[1.02]' : 'border-transparent opacity-80 hover:opacity-100'
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('w-3 h-3 rounded-full', config.dot)} />
        <div>
          <p className="font-semibold text-sm">{config.label}</p>
          <p className="text-xs opacity-70 mt-0.5">{config.desc}</p>
        </div>
      </div>
    </motion.button>
  );
}