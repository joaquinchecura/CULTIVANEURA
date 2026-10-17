import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { NS_CONFIG } from '@/lib/nervous-system';

export const nervousSystemConfig = NS_CONFIG;

export default function StateCard({ state, selected, onClick }) {
  const config = NS_CONFIG[state];
  if (!config) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200',
        config.bgCard,
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