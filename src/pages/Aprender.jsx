import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import LessonCard from '@/components/neuro/LessonCard';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'todos', label: 'Todos' },
  { value: 'sistema_nervioso', label: 'SN' },
  { value: 'emociones', label: 'Emociones' },
  { value: 'habitos', label: 'Hábitos' },
  { value: 'recuperacion', label: 'Recuperación' },
  { value: 'rendimiento', label: 'Rendimiento' },
  { value: 'respiracion', label: 'Respiración' },
];

export default function Aprender() {
  const [lessons, setLessons] = useState([]);
  const [category, setCategory] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NeuroLesson.filter({ is_published: true }, 'order')
      .then(data => { setLessons(data); setLoading(false); });
  }, []);

  const filtered = lessons.filter(l => category === 'todos' || l.category === category);

  return (
    <div className="px-6 pt-12 pb-8">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Biblioteca</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Aprender</h1>
        <p className="text-sm text-muted-foreground mt-1">Neurociencia aplicada a tu vida</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              category === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted rounded-2xl h-52 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">No hay lecciones publicadas aún</p>
          <p className="text-xs text-muted-foreground mt-1">El admin puede crear contenido desde el panel</p>
        </div>
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
    </div>
  );
}