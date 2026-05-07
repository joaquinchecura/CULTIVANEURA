import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Coherencia cardíaca: 5 respiraciones/min = 6s por ciclo (3s inhala, 3s exhala) x 5 min
const TOTAL = 300; // 5 minutos
const CYCLE = 6;   // 6s por ciclo

export default function HRVGame() {
  const [phase, setPhase] = useState('idle'); // idle | running | done
  const [elapsed, setElapsed] = useState(0);
  const [cyclePhase, setCyclePhase] = useState('inhala'); // inhala | exhala
  const [cycleElapsed, setCycleElapsed] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (phase !== 'running') return;
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= TOTAL) {
          clearInterval(intervalRef.current);
          setPhase('done');
          return TOTAL;
        }
        return e + 1;
      });
      setCycleElapsed(ce => {
        const next = (ce + 1) % CYCLE;
        if (next === 0) setCycles(c => c + 1);
        if (next < CYCLE / 2) setCyclePhase('inhala');
        else setCyclePhase('exhala');
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  function start() {
    setElapsed(0);
    setCycleElapsed(0);
    setCycles(0);
    setCyclePhase('inhala');
    setPhase('running');
  }

  function stop() {
    clearInterval(intervalRef.current);
    setPhase('idle');
    setElapsed(0);
  }

  const timeLeft = TOTAL - elapsed;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isInhala = cyclePhase === 'inhala';
  const cycleProgress = cycleElapsed / (CYCLE / 2);

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Coherencia cardíaca (5 min)</p>
            <p className="text-muted-foreground">5 respiraciones por minuto sincronizan tu corazón y cerebro. Reduce cortisol y mejora la variabilidad de la frecuencia cardíaca (HRV).</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700">Iniciar 5 min</Button>
        </div>
      )}

      {phase === 'running' && (
        <>
          <div className="relative flex items-center justify-center">
            {/* Outer pulse ring */}
            <motion.div
              className="absolute w-56 h-56 rounded-full border-2 border-indigo-200"
              animate={{ scale: isInhala ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 1, repeat: isInhala ? Infinity : 0 }}
            />
            {/* Main circle */}
            <motion.div
              className="w-44 h-44 rounded-full flex flex-col items-center justify-center border-4"
              animate={{
                scale: isInhala ? 1.25 : 1,
                borderColor: isInhala ? '#6366f1' : '#a5b4fc',
                backgroundColor: isInhala ? '#eef2ff' : '#f5f3ff',
              }}
              transition={{ duration: CYCLE / 2, ease: 'easeInOut' }}
            >
              <motion.p
                key={cyclePhase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold text-indigo-700"
              >
                {isInhala ? 'Inhalá' : 'Exhalá'}
              </motion.p>
              <p className="text-sm text-indigo-400 mt-1">{CYCLE / 2 - (cycleElapsed % (CYCLE / 2))}s</p>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-serif text-foreground">{mins}:{secs.toString().padStart(2, '0')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{cycles} ciclos · 5/min</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(elapsed / TOTAL) * 100}%` }} />
          </div>

          <Button onClick={stop} variant="outline" className="rounded-xl">Detener</Button>
        </>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 w-full">
          <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6">
            <p className="text-3xl mb-2">💜</p>
            <p className="font-serif text-xl text-foreground">5 minutos completados</p>
            <p className="text-sm text-muted-foreground mt-2">{cycles} ciclos de coherencia cardíaca. Tu HRV mejoró.</p>
          </div>
          <Button onClick={start} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700">Repetir</Button>
        </motion.div>
      )}
    </div>
  );
}