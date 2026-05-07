import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LEVELS = [
  { label: 'Principiante', seconds: 30, color: 'from-sky-200 to-blue-300', hint: 'Terminá con 30s de agua fría' },
  { label: 'Intermedio', seconds: 60, color: 'from-blue-300 to-blue-500', hint: 'Un minuto de agua fría' },
  { label: 'Avanzado', seconds: 120, color: 'from-blue-500 to-indigo-600', hint: '2 minutos de agua fría' },
];

export default function ColdExposureGame() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [phase, setPhase] = useState('select'); // select | ready | running | done
  const [timeLeft, setTimeLeft] = useState(0);
  const [best, setBest] = useState({});
  const intervalRef = useRef(null);

  const level = LEVELS[selectedLevel];

  function startTimer() {
    setPhase('running');
    setTimeLeft(level.seconds);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setPhase('done');
          setBest(b => ({ ...b, [selectedLevel]: level.seconds }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    setPhase('select');
    setSelectedLevel(null);
  }

  const progress = level ? (timeLeft / level.seconds) : 0;

  return (
    <div className="flex flex-col gap-5">
      {phase === 'select' && (
        <>
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sm">
            <p className="font-semibold text-foreground mb-1">Exposición al frío</p>
            <p className="text-muted-foreground text-xs">El agua fría activa el nervio vago, libera noradrenalina y entrena la tolerancia al estrés. Usá este timer durante tu ducha fría.</p>
          </div>

          <div className="space-y-3">
            {LEVELS.map((l, i) => (
              <button
                key={i}
                onClick={() => { setSelectedLevel(i); setPhase('ready'); }}
                className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                  selectedLevel === i ? 'border-sky-400 bg-sky-50' : 'border-border bg-card hover:border-sky-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{l.label}</p>
                  <p className="text-sm font-semibold text-sky-600">{l.seconds}s</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{l.hint}</p>
                {best[i] && <p className="text-xs text-emerald-600 mt-1">✓ Completado</p>}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'ready' && level && (
        <div className="text-center space-y-5">
          <div className={`rounded-3xl p-6 bg-gradient-to-br ${level.color} text-white`}>
            <p className="text-5xl font-serif">{level.seconds}s</p>
            <p className="text-sm mt-1 opacity-80">{level.label}</p>
          </div>
          <p className="text-sm text-muted-foreground">Entrá al agua fría y presioná Iniciar</p>
          <Button onClick={startTimer} className="w-full rounded-xl bg-sky-600 hover:bg-sky-700">
            ❄️ Iniciar timer
          </Button>
          <button onClick={() => setPhase('select')} className="text-xs text-muted-foreground">← Cambiar nivel</button>
        </div>
      )}

      {phase === 'running' && level && (
        <div className="text-center space-y-5">
          <div className="relative flex items-center justify-center">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e0f2fe" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="44" fill="none"
                stroke="#0284c7" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-4xl font-serif text-sky-700">{timeLeft}</p>
              <p className="text-xs text-sky-500">segundos</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Respirá. Estás más fuerte de lo que creés.</p>
          <Button onClick={stop} variant="outline" className="w-full rounded-xl">Salir</Button>
        </div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6">
            <p className="text-4xl mb-2">❄️</p>
            <p className="font-serif text-xl text-foreground">¡Lo lograste!</p>
            <p className="text-sm text-muted-foreground mt-2">Completaste {level?.seconds} segundos. Tu sistema nervioso acaba de volverse más resiliente.</p>
          </div>
          <Button onClick={() => { setPhase('select'); setSelectedLevel(null); }} variant="outline" className="w-full rounded-xl">
            Volver
          </Button>
        </motion.div>
      )}
    </div>
  );
}