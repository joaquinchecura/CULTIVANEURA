import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ROUNDS = 5;

export default function ReactionGame() {
  const [phase, setPhase] = useState('idle'); // idle | waiting | ready | clicked | done
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const [early, setEarly] = useState(false);
  const timeoutRef = useRef(null);

  function startRound() {
    setEarly(false);
    setPhase('waiting');
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setStartTime(Date.now());
      setPhase('ready');
    }, delay);
  }

  function handleTap() {
    if (phase === 'waiting') {
      clearTimeout(timeoutRef.current);
      setEarly(true);
      setPhase('clicked');
      return;
    }

    if (phase === 'ready') {
      const reaction = Date.now() - startTime;
      setLastTime(reaction);
      setTimes(t => [...t, reaction]);
      setRound(r => r + 1);

      if (round + 1 >= ROUNDS) {
        setPhase('done');
      } else {
        setPhase('clicked');
      }
    }
  }

  function nextRound() {
    startRound();
  }

  function reset() {
    setPhase('idle');
    setRound(0);
    setTimes([]);
    setLastTime(null);
    setEarly(false);
  }

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

  function getLabel(ms) {
    if (ms < 200) return { text: '⚡ Excelente', color: 'text-emerald-600' };
    if (ms < 300) return { text: '✓ Bueno', color: 'text-amber-600' };
    return { text: '○ Normal', color: 'text-muted-foreground' };
  }

  const bgColor = phase === 'waiting' ? 'bg-amber-100 border-amber-300'
    : phase === 'ready' ? 'bg-emerald-100 border-emerald-400'
    : 'bg-muted border-border';

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Tiempo de reacción</p>
            <p className="text-muted-foreground">Cuando la pantalla se ponga <strong>verde</strong>, tocá lo más rápido que puedas. Vas a hacer {ROUNDS} intentos.</p>
          </div>
          <Button onClick={() => { setRound(0); setTimes([]); startRound(); }} className="rounded-xl px-8 bg-amber-600 hover:bg-amber-700">
            Iniciar
          </Button>
        </div>
      )}

      {(phase === 'waiting' || phase === 'ready') && (
        <motion.button
          className={`w-full h-56 rounded-3xl border-2 ${bgColor} flex flex-col items-center justify-center gap-2 transition-colors duration-200`}
          onTouchStart={handleTap}
          onClick={handleTap}
          whileTap={{ scale: 0.97 }}
        >
          {phase === 'waiting' ? (
            <>
              <p className="text-2xl font-serif text-amber-700">Esperá...</p>
              <p className="text-sm text-amber-500">No toques todavía</p>
            </>
          ) : (
            <>
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-serif text-emerald-700"
              >
                ¡Ahora!
              </motion.p>
              <p className="text-sm text-emerald-500">Tocá la pantalla</p>
            </>
          )}
        </motion.button>
      )}

      {phase === 'clicked' && (
        <div className="text-center space-y-4 w-full">
          {early ? (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6">
              <p className="text-xl font-serif text-rose-600">Muy rápido 😅</p>
              <p className="text-sm text-muted-foreground mt-1">Esperá la señal verde</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-6">
              <p className="text-4xl font-serif text-foreground">{lastTime}ms</p>
              <p className={`text-sm mt-1 font-medium ${getLabel(lastTime).color}`}>{getLabel(lastTime).text}</p>
              <p className="text-xs text-muted-foreground mt-2">Ronda {round} / {ROUNDS}</p>
            </div>
          )}
          <Button onClick={nextRound} className="w-full rounded-xl bg-amber-600 hover:bg-amber-700">
            {round >= ROUNDS ? 'Ver resultados' : 'Siguiente ronda →'}
          </Button>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-5 w-full">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Promedio</p>
            <p className="text-4xl font-serif text-foreground">{avg}ms</p>
            <p className={`text-sm font-medium mt-1 ${getLabel(avg).color}`}>{getLabel(avg).text}</p>
            <div className="mt-4 space-y-1.5">
              {times.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-xs px-1">
                  <span className="text-muted-foreground">Ronda {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-amber-200 rounded-full" style={{ width: `${(t / 600) * 80}px` }} />
                    <span className="font-medium text-foreground w-12 text-right">{t}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <Button onClick={reset} variant="outline" className="w-full rounded-xl">
            Jugar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}