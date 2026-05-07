import { motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeColors = {
  respiracion: 'bg-sky-100 text-sky-700',
  movimiento: 'bg-emerald-100 text-emerald-700',
  mentalidad: 'bg-violet-100 text-violet-700',
  recuperacion: 'bg-amber-100 text-amber-700',
  nutricion: 'bg-orange-100 text-orange-700',
};

const typeLabels = {
  respiracion: 'Respiración',
  movimiento: 'Movimiento',
  mentalidad: 'Mentalidad',
  recuperacion: 'Recuperación',
  nutricion: 'Nutrición',
};

export default function InterventionCard({ intervention, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', typeColors[intervention.type] || 'bg-muted text-muted-foreground')}>
              {typeLabels[intervention.type] || intervention.type}
            </span>
          </div>
          <h3 className="font-semibold text-foreground text-sm leading-snug">{intervention.title}</h3>
          {intervention.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{intervention.description}</p>
          )}
          {intervention.duration_minutes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{intervention.duration_minutes} min</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Play size={16} className="text-primary ml-0.5" />
        </div>
      </div>
    </motion.div>
  );
}