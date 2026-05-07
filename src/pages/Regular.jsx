import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import InterventionCard from '@/components/neuro/InterventionCard';
import { Button } from '@/components/ui/button';
import { X, Clock, ChevronLeft } from 'lucide-react';

const filterOptions = [
  { value: 'todos', label: 'Todos' },
  { value: 'regulado', label: '🟢 Regulado' },
  { value: 'activado', label: '🟡 Activado' },
  { value: 'colapsado', label: '🔴 Colapsado' },
];

export default function Regular() {
  const [interventions, setInterventions] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Intervention.filter({ is_active: true }, 'title')
      .then(data => { setInterventions(data); setLoading(false); });
  }, []);

  const filtered = interventions.filter(i =>
    filter === 'todos' || i.target_state === 'todos' || i.target_state === filter
  );

  return (
    <div className="px-6 pt-12 pb-8">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Regulación</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Regular ahora</h1>
        <p className="text-sm text-muted-foreground mt-1">Intervenciones según tu estado</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">No hay intervenciones disponibles</p>
          <p className="text-xs text-muted-foreground mt-1">El admin puede agregar contenido desde el panel</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((intervention, i) => (
            <motion.div
              key={intervention.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <InterventionCard intervention={intervention} onClick={() => setSelected(intervention)} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card rounded-t-3xl w-full max-w-md p-6 pb-10 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-serif text-xl text-foreground flex-1 pr-4">{selected.title}</h2>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {selected.duration_minutes && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                  <Clock size={14} />
                  <span>{selected.duration_minutes} minutos</span>
                </div>
              )}

              {selected.description && (
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{selected.description}</p>
              )}

              {selected.instructions && (
                <div className="bg-muted rounded-2xl p-4 mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Instrucciones</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{selected.instructions}</p>
                </div>
              )}

              {selected.video_url && (
                <div className="mb-4">
                  <video
                    src={selected.video_url}
                    controls
                    className="w-full rounded-2xl"
                  />
                </div>
              )}

              {selected.audio_url && (
                <div className="mb-4">
                  <audio src={selected.audio_url} controls className="w-full" />
                </div>
              )}

              <Button className="w-full rounded-xl" onClick={() => setSelected(null)}>
                Completar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}