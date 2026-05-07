import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Math problems under time pressure = stress inoculation training
function generateProblem(difficulty) {
  if (difficulty <= 2) {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 20) + 5;
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const answer = op === '+' ? a + b : a - b;
    return { question: `${a} ${op} ${b}`, answer };
  } else {
    const a = Math.floor(Math.random() * 12) + 3;
    const b = Math.floor(Math.random() * 12) + 3;
    const answer = a * b;
    return { question: `${a} × ${b}`, answer };
  }
}

const GAME_TIME = 60;

export default function StressInoculationGame() {
  const [phase, setPhase] = useState('idle');
  const [problem, setProblem] = useState(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [shake, setShake] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function start() {
    setScore(0); setErrors(0); setTimeLeft(GAME_TIME); setInput('');
    setProblem(generateProblem(difficulty));
    setPhase('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function submit() {
    if (!input) return;
    const num = parseInt(input);
    if (num === problem.answer) {
      setScore(s => s + 1);
      const newDiff = Math.min(3, Math.floor(score / 5) + 1);
      setDifficulty(newDiff);
      setProblem(generateProblem(newDiff));
    } else {
      setErrors(e => e + 1);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
    setInput('');
    inputRef.current?.focus();
  }

  const accuracy = score + errors > 0 ? Math.round(score / (score + errors) * 100) : 0;
  const urgency = timeLeft < 15 ? 'text-rose-500' : timeLeft < 30 ? 'text-amber-500' : 'text-foreground';

  return (
    <div className="flex flex-col items-center gap-5">
      {phase === 'idle' && (
        <div className="text-center space-y-4 w-full">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-sm text-left max-w-xs mx-auto">
            <p className="font-semibold text-foreground mb-2">Inoculación de estrés</p>
            <p className="text-muted-foreground">Resolver problemas bajo presión de tiempo entrena tu SN a funcionar bajo activación. 60 segundos, máximas respuestas correctas.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-orange-500 hover:bg-orange-600">Iniciar</Button>
        </div>
      )}

      {phase === 'playing' && problem && (
        <div className="w-full space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">✓ {score} · ✗ {errors}</span>
            <span className={`text-2xl font-serif font-bold ${urgency}`}>{timeLeft}s</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full transition-all duration-1000 ${timeLeft < 15 ? 'bg-rose-500' : 'bg-orange-500'}`}
              style={{ width: `${(timeLeft / GAME_TIME) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={problem.question}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center h-28">
              <p className="text-5xl font-serif text-foreground">{problem.question}</p>
            </motion.div>
          </AnimatePresence>

          <motion.div animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.3 }}>
            <input
              ref={inputRef}
              type="number"
              className="w-full text-center text-2xl font-serif rounded-2xl border-2 border-border bg-card py-4 outline-none focus:border-orange-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="?"
            />
          </motion.div>
          <Button onClick={submit} disabled={!input} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 py-5 text-lg">
            Confirmar →
          </Button>
        </div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 w-full">
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6">
            <p className="text-4xl font-serif">{score}</p>
            <p className="text-sm text-muted-foreground mt-1">respuestas correctas</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div><p className="font-semibold">{accuracy}%</p><p className="text-xs text-muted-foreground">precisión</p></div>
              <div><p className="font-semibold">{errors}</p><p className="text-xs text-muted-foreground">errores</p></div>
            </div>
          </div>
          <Button onClick={start} className="w-full rounded-xl bg-orange-500 hover:bg-orange-600">Otra vez</Button>
        </motion.div>
      )}
    </div>
  );
}