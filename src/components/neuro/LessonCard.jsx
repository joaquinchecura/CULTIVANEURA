import { motion } from 'framer-motion';
import { Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const categoryColors = {
  sistema_nervioso: 'bg-emerald-100 text-emerald-700',
  emociones: 'bg-rose-100 text-rose-700',
  habitos: 'bg-amber-100 text-amber-700',
  recuperacion: 'bg-sky-100 text-sky-700',
  rendimiento: 'bg-violet-100 text-violet-700',
  respiracion: 'bg-teal-100 text-teal-700',
};

const categoryLabels = {
  sistema_nervioso: 'Sistema Nervioso',
  emociones: 'Emociones',
  habitos: 'Hábitos',
  recuperacion: 'Recuperación',
  rendimiento: 'Rendimiento',
  respiracion: 'Respiración',
};

export default function LessonCard({ lesson }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="block">
      <Link to={`/aprender/${lesson.id}`} className="block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
        {lesson.cover_image_url && (
          <img
            src={lesson.cover_image_url}
            alt={lesson.title}
            className="w-full h-36 object-cover"
          />
        )}
        {!lesson.cover_image_url && (
          <div className="w-full h-24 bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
            <BookOpen size={32} className="text-primary/40" />
          </div>
        )}
        <div className="p-4 space-y-2">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', categoryColors[lesson.category] || 'bg-muted text-muted-foreground')}>
            {categoryLabels[lesson.category] || lesson.category}
          </span>
          <h3 className="font-serif text-base text-foreground leading-snug">{lesson.title}</h3>
          {lesson.summary && (
            <p className="text-xs text-muted-foreground line-clamp-2">{lesson.summary}</p>
          )}
          {lesson.duration_minutes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{lesson.duration_minutes} min de lectura</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}