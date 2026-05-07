import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const PHASES = [
  { label: 'Inhalá', duration: 4000, scale: 1.6 },
  { label: 'Sostené', duration: 2000, scale: 1.6 },
  { label: 'Exhalá', duration: 6000, scale: 1 },
  { label: 'Pausa', duration: 2000, scale: 1 },
];

export default function BreathingGame() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  const phase = PHASES[phaseIdx];

  useEffect(() => {
    if (!running) return;

    timerRef.current = setTimeout(() => {
      const next = (phaseIdx + 1) % PHASES.length;
      if (next === 0) setCycles(c => c + 1);
      setPhaseIdx(next);
      setElapsed(0);
    }, phase.duration);

    elapsedRef.current = setInterval(() => {
      setElapsed(e => e + 100);
    }, 100);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(elapsedRef.current);
    };
  }, [running, phaseIdx]);

  function start() {
    setRunning(true);
    setPhaseIdx(0);
    setCycles(0);
    setElapsed(0);
  }

  function stop() {
    setRunning(false);
    setPhaseIdx(0);
    setElapsed(0);
  }

  const progress = elapsed / phase.duration;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Outer ring */}
        <motion.div
          className="absolute w-64 h-64 rounded-full border-2 border-emerald-200"
          animate={running ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Breathing circle */}
        <motion.div
          className="w-40 h-40 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center"
          animate={{ scale: running ? phase.scale : 1 }}
          transition={{ duration: phase.duration / 1000, ease: 'easeInOut' }}
        >
          <div className="text-center">
            {running ? (
              <>
                <p className="text-emerald-700 font-semibold text-lg">{phase.label}</p>
                <p className="text-emerald-500 text-sm mt-1">{Math.ceil((phase.duration - elapsed) / 1000)}s</p>
              </>
            ) : (
              <p className="text-emerald-600 text-sm font-medium">Listo</p>
            )}
          </div>
        </motion.div>
      </div>

      {running && (
        <div className="text-center">
          <p className="text-2xl font-serif text-foreground">{cycles}</p>
          <p className="text-xs text-muted-foreground">ciclos completados</p>
        </div>
      )}

      <div className="flex gap-3">
        {!running ? (
          <Button onClick={start} className="rounded-xl px-8 bg-emerald-600 hover:bg-emerald-700">
            Iniciar
          </Button>
        ) : (
          <Button onClick={stop} variant="outline" className="rounded-xl px-8">
            Detener
          </Button>
        )}
      </div>

      {!running && (
        <div className="bg-muted rounded-2xl p-4 text-xs text-muted-foreground text-center max-w-xs">
          <p className="font-medium text-foreground mb-1">4-2-6-2 coherente</p>
          Inhalá 4s · Sostené 2s · Exhalá 6s · Pausa 2s. Activa el nervio vago y desacelera tu corazón.
        </div>
      )}
    </div>
  );
}