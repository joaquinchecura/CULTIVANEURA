import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { categoryLabels } from '@/lib/neuroConstants';

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NeuroLesson.filter({ id }, '-created_date', 1)
      .then(data => { if (data.length) setLesson(data[0]); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="px-6 pt-12">
        <div className="h-48 bg-muted rounded-3xl animate-pulse mb-6" />
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded-xl animate-pulse w-2/3" />
          <div className="h-4 bg-muted rounded-xl animate-pulse" />
          <div className="h-4 bg-muted rounded-xl animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!lesson) return (
    <div className="px-6 pt-12 text-center">
      <p className="text-muted-foreground">Lección no encontrada</p>
      <Link to="/aprender" className="text-primary text-sm">← Volver</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Cover */}
      {lesson.cover_image_url ? (
        <div className="relative">
          <img src={lesson.cover_image_url} alt={lesson.title} className="w-full h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Link to="/aprender" className="absolute top-12 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
            <ChevronLeft size={18} className="text-foreground" />
          </Link>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-primary/10 to-accent h-40 flex items-center justify-center">
          <BookOpen size={40} className="text-primary/30" />
          <Link to="/aprender" className="absolute top-12 left-4 bg-card rounded-full p-2 border border-border">
            <ChevronLeft size={18} className="text-foreground" />
          </Link>
        </div>
      )}

      <div className="px-6 pt-6 pb-10 space-y-4">
        {lesson.category && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {categoryLabels[lesson.category] || lesson.category}
          </span>
        )}
        <h1 className="font-serif text-2xl text-foreground leading-snug">{lesson.title}</h1>

        {lesson.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed">{lesson.summary}</p>
        )}

        {lesson.duration_minutes && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={13} />
            <span>{lesson.duration_minutes} min de lectura</span>
          </div>
        )}

        <hr className="border-border" />

        {lesson.video_url && (
          <div>
            <video src={lesson.video_url} controls className="w-full rounded-2xl" />
          </div>
        )}

        {lesson.content && (
          <div className="prose prose-sm max-w-none text-foreground">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="text-sm text-foreground leading-relaxed mb-3">{children}</p>,
                h2: ({ children }) => <h2 className="font-serif text-lg text-foreground mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="font-semibold text-sm text-foreground mt-4 mb-1">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
                li: ({ children }) => <li className="text-sm text-foreground">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}