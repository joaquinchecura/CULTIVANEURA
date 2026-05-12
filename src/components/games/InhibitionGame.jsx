import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GAME_DURATION = 45;
const STIMULI = ['🟢', '🔵', '🟡', '🔴'];
const TARGET = '🟢';

function randomStimulus() {
  return STIMULI[Math.floor(Math.random() * STIMULI.length)];
}

export default function InhibitionGame() {
  const [phase, setPhase] = useState('idle');
  const [stimulus, setStimulus] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | 'miss'
  const timerRef = useRef(null);
  const stimulusRef = useRef(null);
  const currentRef = useRef(null);

  const showNext = useCallback(() => {
    const s = randomStimulus();
    setStimulus(s);
    currentRef.current = s;
    setFeedback(null);

    // Auto-advance after 1.2s — if target not tapped, count as miss only if it was target
    stimulusRef.current = setTimeout(() => {
      setFeedback(null);
      showNext();
    }, 1200);
  }, []);

  function start() {
    setScore(0);
    setErrors(0);
    setTimeLeft(GAME_DURATION);
    setPhase('playing');
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    showNext();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearTimeout(stimulusRef.current);
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(stimulusRef.current);
    };
  }, [phase]);

  function handleTap() {
    if (phase !== 'playing') return;
    clearTimeout(stimulusRef.current);
    if (currentRef.current === TARGET) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setErrors(e => e + 1);
      setFeedback('wrong');
    }
    setTimeout(() => { setFeedback(null); showNext(); }, 300);
  }

  const accuracy = score + errors > 0 ? Math.round((score / (score + errors)) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Control Inhibitorio</p>
            <p className="text-muted-foreground">Tocá la pantalla <strong>solo cuando aparezca 🟢</strong>. Ignorá todos los otros colores. Entrena tu capacidad de inhibir respuestas automáticas.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-green-600 hover:bg-green-700">Iniciar</Button>
        </div>
      )}

      {phase === 'playing' && (
        <>
          <div className="w-full flex justify-between text-sm px-2">
            <span className="text-muted-foreground">✓ {score} · ✗ {errors}</span>
            <span className="font-medium">{timeLeft}s</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
          </div>

          <p className="text-xs text-muted-foreground">Solo tocá si aparece 🟢</p>

          <AnimatePresence mode="wait">
            <motion.button
              key={stimulus + Math.random()}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleTap}
              className={`w-40 h-40 rounded-3xl flex items-center justify-center text-8xl transition-all select-none ${
                feedback === 'correct' ? 'bg-green-100' :
                feedback === 'wrong' ? 'bg-rose-100' :
                'bg-muted hover:bg-muted/80'
              }`}
            >
              {stimulus}
            </motion.button>
          </AnimatePresence>

          <AnimatePresence>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm font-medium ${feedback === 'correct' ? 'text-green-600' : 'text-rose-500'}`}
              >
                {feedback === 'correct' ? '✓ Correcto' : '✗ Error'}
              </motion.p>
            )}
          </AnimatePresence>
        </>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-5">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 border border-green-200 rounded-3xl p-6">
            <p className="text-4xl font-serif">{score}</p>
            <p className="text-sm text-muted-foreground mt-1">respuestas correctas</p>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div><p className="font-semibold">{accuracy}%</p><p className="text-muted-foreground text-xs">precisión</p></div>
              <div><p className="font-semibold">{errors}</p><p className="text-muted-foreground text-xs">errores</p></div>
            </div>
          </motion.div>
          <Button onClick={start} className="rounded-xl px-8 bg-green-600 hover:bg-green-700">Jugar de nuevo</Button>
        </div>
      )}
    </div>
  );
}
