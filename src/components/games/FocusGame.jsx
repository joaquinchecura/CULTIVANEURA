import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const COLORS = ['rojo', 'azul', 'verde', 'amarillo'];
const COLOR_MAP = {
  rojo: '#ef4444',
  azul: '#3b82f6',
  verde: '#22c55e',
  amarillo: '#eab308',
};
const GAME_DURATION = 45;

function generateItem() {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { word, color };
}

export default function FocusGame() {
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [item, setItem] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const timerRef = useRef(null);

  const nextItem = useCallback(() => setItem(generateItem()), []);

  useEffect(() => {
    if (phase !== 'playing') return;
    nextItem();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function start() {
    setScore(0);
    setErrors(0);
    setTimeLeft(GAME_DURATION);
    setPhase('playing');
  }

  function answer(isMatch) {
    const correct = (item.word === item.color) === isMatch;
    if (correct) setScore(s => s + 1);
    else setErrors(e => e + 1);
    nextItem();
  }

  const accuracy = score + errors > 0 ? Math.round((score / (score + errors)) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Efecto Stroop</p>
            <p className="text-muted-foreground">Vas a ver palabras de colores escritas con otro color. Respondé si <strong>la palabra coincide con el color</strong> en que está escrita.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-violet-600 hover:bg-violet-700">
            Iniciar
          </Button>
        </div>
      )}

      {phase === 'playing' && item && (
        <>
          <div className="w-full flex justify-between text-sm px-2">
            <span className="text-muted-foreground">✓ {score} · ✗ {errors}</span>
            <span className="font-medium text-foreground">{timeLeft}s</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.word + item.color}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center justify-center h-32"
            >
              <p
                className="text-5xl font-serif font-bold capitalize"
                style={{ color: COLOR_MAP[item.color] }}
              >
                {item.word}
              </p>
            </motion.div>
          </AnimatePresence>

          <p className="text-xs text-muted-foreground">¿La palabra describe el color en que está escrita?</p>

          <div className="flex gap-4 w-full">
            <Button
              onClick={() => answer(true)}
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
            >
              ✓ Sí
            </Button>
            <Button
              onClick={() => answer(false)}
              className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-lg py-6"
            >
              ✗ No
            </Button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-5">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-violet-50 border border-violet-200 rounded-3xl p-6">
            <p className="text-4xl font-serif text-foreground">{score}</p>
            <p className="text-sm text-muted-foreground mt-1">respuestas correctas</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div><p className="font-semibold text-foreground">{accuracy}%</p><p className="text-muted-foreground text-xs">precisión</p></div>
              <div><p className="font-semibold text-foreground">{errors}</p><p className="text-muted-foreground text-xs">errores</p></div>
            </div>
          </motion.div>
          <Button onClick={start} className="rounded-xl px-8 bg-violet-600 hover:bg-violet-700">
            Jugar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}