import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const SHAPES = [
  { id: 'L', path: 'M10 10 L10 50 L30 50 L30 30 L50 30 L50 10 Z' },
  { id: 'T', path: 'M10 10 L50 10 L50 25 L35 25 L35 55 L25 55 L25 25 L10 25 Z' },
  { id: 'S', path: 'M25 10 L50 10 L50 30 L35 30 L35 50 L10 50 L10 30 L25 30 Z' },
  { id: 'F', path: 'M10 10 L50 10 L50 25 L25 25 L25 35 L45 35 L45 50 L25 50 L25 55 L10 55 Z' },
];

const ROTATIONS = [0, 90, 180, 270];

function randomRotation() {
  return ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
}

function ShapeSVG({ path, rotation, size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <g transform={`rotate(${rotation}, 30, 30)`}>
        <path d={path} fill="currentColor" />
      </g>
    </svg>
  );
}

function generateRound() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const baseRotation = randomRotation();
  const correctRotation = randomRotation();

  // Generate 3 wrong options (different rotations)
  const wrongRotations = ROTATIONS.filter(r => r !== correctRotation);
  const shuffledWrong = wrongRotations.sort(() => Math.random() - 0.5).slice(0, 3);

  const options = [...shuffledWrong, correctRotation].sort(() => Math.random() - 0.5);

  return { shape, baseRotation, correctRotation, options };
}

const TOTAL_ROUNDS = 10;

export default function MentalRotationGame() {
  const [phase, setPhase] = useState('idle');
  const [round, setRound] = useState(null);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const startGame = useCallback(() => {
    setScore(0);
    setRoundNum(1);
    setRound(generateRound());
    setFeedback(null);
    setPhase('playing');
  }, []);

  function handleAnswer(rotation) {
    const isCorrect = rotation === round.correctRotation;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (roundNum >= TOTAL_ROUNDS) {
        setPhase('done');
      } else {
        setRoundNum(n => n + 1);
        setRound(generateRound());
        setFeedback(null);
      }
    }, 600);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Rotación Mental</p>
            <p className="text-muted-foreground">Se muestra una figura con una rotación de referencia. Elegí cuál de las 4 opciones es la <strong>misma figura rotada correctamente</strong>.</p>
          </div>
          <Button onClick={startGame} className="rounded-xl px-8 bg-purple-600 hover:bg-purple-700">Iniciar</Button>
        </div>
      )}

      {phase === 'playing' && round && (
        <div className="w-full flex flex-col items-center gap-5">
          <div className="w-full flex justify-between text-sm px-2">
            <span className="text-muted-foreground">Ronda {roundNum}/{TOTAL_ROUNDS}</span>
            <span className="font-medium">✓ {score}</span>
          </div>

          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${(roundNum / TOTAL_ROUNDS) * 100}%` }} />
          </div>

          <p className="text-xs text-muted-foreground">Figura de referencia</p>
          <div className="w-28 h-28 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-purple-600">
            <ShapeSVG path={round.shape.path} rotation={round.baseRotation} size={80} />
          </div>

          <p className="text-xs text-muted-foreground">¿Cuál es la misma figura rotada {round.correctRotation}°?</p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {round.options.map((rotation, i) => (
              <AnimatePresence key={i} mode="wait">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !feedback && handleAnswer(rotation)}
                  className={`h-24 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    feedback && rotation === round.correctRotation
                      ? 'border-green-400 bg-green-50 text-green-600'
                      : feedback && rotation !== round.correctRotation
                        ? 'border-rose-200 bg-rose-50 text-rose-300'
                        : 'border-border bg-card hover:border-purple-300 text-purple-600'
                  }`}
                >
                  <ShapeSVG path={round.shape.path} rotation={rotation} size={60} />
                </motion.button>
              </AnimatePresence>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-5">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="bg-purple-50 border border-purple-200 rounded-3xl p-6">
            <p className="text-4xl font-serif">{score}<span className="text-xl text-muted-foreground">/{TOTAL_ROUNDS}</span></p>
            <p className="text-sm text-muted-foreground mt-1">respuestas correctas</p>
            <p className="text-sm font-medium mt-3">
              {score >= 8 ? '🧠 Excelente rotación espacial' :
               score >= 5 ? '👍 Buen trabajo' : '💪 Seguí practicando'}
            </p>
          </motion.div>
          <Button onClick={startGame} className="rounded-xl px-8 bg-purple-600 hover:bg-purple-700">Jugar de nuevo</Button>
        </div>
      )}
    </div>
  );
}
