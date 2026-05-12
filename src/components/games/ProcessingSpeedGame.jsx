import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GAME_DURATION = 60;

const ITEMS = [
  { symbol: '😀', category: 'cara' },
  { symbol: '😢', category: 'cara' },
  { symbol: '😡', category: 'cara' },
  { symbol: '😱', category: 'cara' },
  { symbol: '🐶', category: 'animal' },
  { symbol: '🐱', category: 'animal' },
  { symbol: '🐸', category: 'animal' },
  { symbol: '🦊', category: 'animal' },
  { symbol: '🍎', category: 'comida' },
  { symbol: '🍕', category: 'comida' },
  { symbol: '🍦', category: 'comida' },
  { symbol: '🥑', category: 'comida' },
];

const CATEGORIES = ['cara', 'animal', 'comida'];
const CATEGORY_COLORS = {
  cara: 'bg-yellow-500 hover:bg-yellow-600',
  animal: 'bg-emerald-500 hover:bg-emerald-600',
  comida: 'bg-rose-500 hover:bg-rose-600',
};
const CATEGORY_LABELS = {
  cara: '😀 Cara',
  animal: '🐶 Animal',
  comida: '🍎 Comida',
};

function randomItem() {
  return ITEMS[Math.floor(Math.random() * ITEMS.length)];
}

export default function ProcessingSpeedGame() {
  const [phase, setPhase] = useState('idle');
  const [current, setCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);

  const nextItem = useCallback(() => {
    setCurrent(randomItem());
    setFeedback(null);
  }, []);

  function start() {
    setScore(0);
    setErrors(0);
    setTimeLeft(GAME_DURATION);
    setPhase('playing');
  }

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

  function handleAnswer(category) {
    if (!current || feedback) return;
    const isCorrect = category === current.category;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setErrors(e => e + 1);
      setFeedback('wrong');
    }
    setTimeout(() => nextItem(), 250);
  }

  const accuracy = score + errors > 0 ? Math.round((score / (score + errors)) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Velocidad de Procesamiento</p>
            <p className="text-muted-foreground">Clasificá cada símbolo lo más rápido posible en su categoría correcta: <strong>Cara, Animal o Comida</strong>. Entrena la velocidad cognitiva.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-pink-600 hover:bg-pink-700">Iniciar</Button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full flex flex-col items-center gap-5">
          <div className="w-full flex justify-between text-sm px-2">
            <span className="text-muted-foreground">✓ {score} · ✗ {errors}</span>
            <span className="font-medium">{timeLeft}s</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current?.symbol}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`w-36 h-36 rounded-3xl flex items-center justify-center text-7xl border-2 transition-all ${
                feedback === 'correct' ? 'bg-emerald-50 border-emerald-300' :
                feedback === 'wrong' ? 'bg-rose-50 border-rose-300' :
                'bg-muted border-border'
              }`}
            >
              {current?.symbol}
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-2 w-full">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                onClick={() => handleAnswer(cat)}
                className={`${CATEGORY_COLORS[cat]} text-white rounded-xl py-4 text-xs font-medium`}
              >
                {CATEGORY_LABELS[cat]}
              </Button>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-5">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="bg-pink-50 border border-pink-200 rounded-3xl p-6">
            <p className="text-4xl font-serif">{score}</p>
            <p className="text-sm text-muted-foreground mt-1">clasificaciones correctas</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div><p className="font-semibold">{accuracy}%</p><p className="text-muted-foreground text-xs">precisión</p></div>
              <div><p className="font-semibold">{errors}</p><p className="text-muted-foreground text-xs">errores</p></div>
              <div><p className="font-semibold">{score + errors}</p><p className="text-muted-foreground text-xs">total</p></div>
            </div>
            <p className="text-sm font-medium mt-3">
              {score >= 40 ? '⚡ Velocidad excelente' :
               score >= 25 ? '👍 Buen procesamiento' : '💪 Seguí practicando'}
            </p>
          </motion.div>
          <Button onClick={start} className="rounded-xl px-8 bg-pink-600 hover:bg-pink-700">Jugar de nuevo</Button>
        </div>
      )}
    </div>
  );
}
