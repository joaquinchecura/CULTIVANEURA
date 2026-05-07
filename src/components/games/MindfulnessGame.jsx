import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const DURATIONS = [60, 180, 300];
const LABELS = ['1 min', '3 min', '5 min'];
const BELLS = ['Inicio', 'Mitad', 'Final'];

export default function MindfulnessGame() {
  const [selectedDur, setSelectedDur] = useState(0);
  const [phase, setPhase] = useState('select'); // select | running | done
  const [elapsed, setElapsed] = useState(0);
  const [thought, setThought] = useState(0);
  const intervalRef = useRef(null);
  const duration = DURATIONS[selectedDur];

  useEffect(() => {
    if (phase !== 'running') return;
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= duration) {
          clearInterval(intervalRef.current);
          setPhase('done');
          return duration;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase, duration]);

  function start() {
    setElapsed(0);
    setThought(0);
    setPhase('running');
  }

  function stop() {
    clearInterval(intervalRef.current);
    setPhase('select');
    setElapsed(0);
  }

  const progress = elapsed / duration;
  const timeLeft = duration - elapsed;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  // Breathing guide during meditation: 4s in, 4s out
  const breathCycle = elapsed % 8;
  const isInhala = breathCycle < 4;

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'select' && (
        <div className="text-center space-y-5 w-full">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-sm text-left">
            <p className="font-semibold text-foreground mb-1">Meditación guiada</p>
            <p className="text-muted-foreground text-xs">Seguí el círculo con tu respiración. Cuando aparezca un pensamiento, notalo y volvé al círculo. Eso es todo.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((d, i) => (
              <button key={i} onClick={() => setSelectedDur(i)}
                className={`rounded-2xl py-3 border-2 text-sm font-medium transition-all ${
                  selectedDur === i ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-border bg-card text-muted-foreground'
                }`}>
                {LABELS[i]}
              </button>
            ))}
          </div>
          <Button onClick={start} className="w-full rounded-xl bg-teal-600 hover:bg-teal-700">Meditar</Button>
        </div>
      )}

      {phase === 'running' && (
        <>
          {/* Breathing orb */}
          <div className="relative flex items-center justify-center w-56 h-56">
            {/* Glow */}
            <motion.div
              className="absolute rounded-full bg-teal-200/40"
              animate={{ width: isInhala ? 220 : 160, height: isInhala ? 220 : 160 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
            />
            <motion.div
              className="w-36 h-36 rounded-full bg-gradient-to-br from-teal-300 to-teal-500 flex flex-col items-center justify-center shadow-lg"
              animate={{ scale: isInhala ? 1.3 : 1 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
            >
              <p className="text-white text-sm font-medium">{isInhala ? 'Inhalá' : 'Exhalá'}</p>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="text-3xl font-serif text-foreground">{mins}:{secs.toString().padStart(2, '0')}</p>
          </div>

          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-teal-400 rounded-full" style={{ width: `${progress * 100}%` }} />
          </div>

          <button onClick={() => setThought(t => t + 1)}
            className="text-xs text-muted-foreground border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors">
            Pensamiento detectado ({thought})
          </button>

          <Button onClick={stop} variant="outline" size="sm" className="rounded-xl">Salir</Button>
        </>
      )}

      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 w-full">
          <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6">
            <p className="text-3xl mb-2">🧘</p>
            <p className="font-serif text-xl text-foreground">{LABELS[selectedDur]} de meditación</p>
            <p className="text-sm text-muted-foreground mt-2">
              Detectaste <strong>{thought}</strong> pensamiento{thought !== 1 ? 's' : ''}. Cada uno que notaste es una repetición de atención.
            </p>
          </div>
          <Button onClick={() => setPhase('select')} variant="outline" className="w-full rounded-xl">Volver</Button>
        </motion.div>
      )}
    </div>
  );
}