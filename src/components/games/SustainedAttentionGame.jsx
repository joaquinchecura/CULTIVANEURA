import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GAME_DURATION = 60;
const SYMBOLS = ['★', '●', '■', '▲', '♦', '★', '★', '●'];
const TARGET_SYMBOL = '★';
const DISPLAY_INTERVAL = 1200;

export default function SustainedAttentionGame() {
  const [phase, setPhase] = useState('idle');
  const [current, setCurrent] = useState(null);
  const [targetCount, setTargetCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [taps, setTaps] = useState(0);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const countRef = useRef(0);

  function start() {
    setTargetCount(0);
    setUserCount(0);
    setTaps(0);
    setTimeLeft(GAME_DURATION);
    countRef.current = 0;
    setPhase('playing');
  }

  useEffect(() => {
    if (phase !== 'playing') return;

    intervalRef.current = setInterval(() => {
      const s = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      setCurrent(s);
      if (s === TARGET_SYMBOL) {
        countRef.current += 1;
        setTargetCount(countRef.current);
      }
    }, DISPLAY_INTERVAL);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          clearInterval(timerRef.current);
          setPhase('input');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, [phase]);

  function submitAnswer() {
    setPhase('done');
  }

  const diff = Math.abs(userCount - targetCount);
  const accuracy = targetCount > 0 ? Math.max(0, Math.round((1 - diff / targetCount) * 100)) : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Atención Sostenida</p>
            <p className="text-muted-foreground">Van a aparecer símbolos uno por uno. <strong>Contá mentalmente cuántas veces aparece ★</strong>. Al final ingresás el número. Entrena la atención sostenida.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-orange-500 hover:bg-orange-600">Iniciar</Button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="w-full flex justify-between text-sm px-2">
            <span className="text-muted-foreground">Contá las ★</span>
            <span className="font-medium">{timeLeft}s</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
          </div>

          <motion.div
            key={current}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-40 h-40 rounded-3xl flex items-center justify-center text-7xl ${
              current === TARGET_SYMBOL ? 'bg-orange-50 border-2 border-orange-200' : 'bg-muted border-2 border-border'
            }`}
          >
            {current}
          </motion.div>
          <p className="text-xs text-muted-foreground">Contá mentalmente las ★</p>
        </div>
      )}

      {phase === 'input' && (
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          <p className="text-sm font-medium text-foreground text-center">¿Cuántas veces apareció ★?</p>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setUserCount(c => Math.max(0, c - 1))}
              className="w-12 h-12 text-xl rounded-xl">−</Button>
            <span className="text-5xl font-serif w-16 text-center">{userCount}</span>
            <Button variant="outline" onClick={() => setUserCount(c => c + 1)}
              className="w-12 h-12 text-xl rounded-xl">+</Button>
          </div>
          <Button onClick={submitAnswer} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600">
            Confirmar
          </Button>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-5">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="bg-orange-50 border border-orange-200 rounded-3xl p-6 space-y-3">
            <p className="text-sm text-muted-foreground">Tu respuesta: <strong className="text-foreground">{userCount}</strong></p>
            <p className="text-sm text-muted-foreground">Cantidad real: <strong className="text-foreground">{targetCount}</strong></p>
            <div className="h-px bg-border" />
            <p className="text-3xl font-serif">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">precisión de atención</p>
            <p className="text-sm font-medium">
              {accuracy >= 90 ? '🎯 Atención excelente' :
               accuracy >= 70 ? '👍 Buena atención' : '💪 Seguí practicando'}
            </p>
          </motion.div>
          <Button onClick={start} className="rounded-xl px-8 bg-orange-500 hover:bg-orange-600">Jugar de nuevo</Button>
        </div>
      )}
    </div>
  );
}
