import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LEVELS = [3, 4, 5, 6, 7, 8];

function generateSequence(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
}

export default function NumberSequenceGame() {
  const [phase, setPhase] = useState('idle'); // idle | showing | input | result | done
  const [level, setLevel] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [showIndex, setShowIndex] = useState(-1);
  const [input, setInput] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(false);
  const intervalRef = useRef(null);

  function start() {
    setLevel(0);
    setCorrect(0);
    startRound(0);
  }

  function startRound(lvl) {
    const seq = generateSequence(LEVELS[lvl]);
    setSequence(seq);
    setInput([]);
    setShowIndex(0);
    setPhase('showing');
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      if (i >= seq.length) {
        clearInterval(intervalRef.current);
        setShowIndex(-1);
        setPhase('input');
      } else {
        setShowIndex(i);
      }
    }, 800);
  }

  function handleDigit(digit) {
    const newInput = [...input, digit];
    setInput(newInput);
    if (newInput.length === sequence.length) {
      const isCorrect = newInput.every((d, i) => d === sequence[i]);
      if (isCorrect) {
        setCorrect(c => c + 1);
        const nextLevel = level + 1;
        if (nextLevel >= LEVELS.length) {
          setPhase('done');
        } else {
          setLevel(nextLevel);
          setTimeout(() => startRound(nextLevel), 800);
        }
      } else {
        setWrong(true);
        setTimeout(() => { setWrong(false); setPhase('result'); }, 800);
      }
    }
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Memoria de Dígitos</p>
            <p className="text-muted-foreground">Se mostrarán números uno por uno. Memorizalos y reproducí la secuencia en orden. Cada nivel agrega un dígito más.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-cyan-600 hover:bg-cyan-700">Iniciar</Button>
        </div>
      )}

      {phase === 'showing' && (
        <div className="flex flex-col items-center gap-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Nivel {level + 1} — {LEVELS[level]} dígitos</p>
          <div className="flex gap-2">
            {sequence.map((_, i) => (
              <div key={i} className={`w-8 h-1.5 rounded-full transition-all ${i <= showIndex ? 'bg-cyan-500' : 'bg-muted'}`} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={showIndex}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-32 h-32 rounded-3xl bg-cyan-50 border-2 border-cyan-200 flex items-center justify-center"
            >
              <span className="text-6xl font-serif text-cyan-700">{sequence[showIndex]}</span>
            </motion.div>
          </AnimatePresence>
          <p className="text-xs text-muted-foreground">Memoriza los números</p>
        </div>
      )}

      {phase === 'input' && (
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Reproducí la secuencia</p>
          <div className="flex gap-2 min-h-[36px]">
            {sequence.map((_, i) => (
              <div key={i} className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-lg font-mono font-bold transition-all ${
                i < input.length
                  ? wrong ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-cyan-400 bg-cyan-50 text-cyan-700'
                  : 'border-border bg-muted text-transparent'
              }`}>
                {input[i] || ''}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 w-full">
            {[1,2,3,4,5,6,7,8,9].map(d => (
              <Button key={d} variant="outline" onClick={() => handleDigit(d)}
                className="h-14 text-xl font-mono rounded-xl">
                {d}
              </Button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="bg-rose-50 border border-rose-200 rounded-3xl p-6">
            <p className="text-2xl font-serif text-foreground">Secuencia incorrecta</p>
            <p className="text-sm text-muted-foreground mt-2">Llegaste al nivel {level + 1} ({LEVELS[level]} dígitos)</p>
            <p className="text-sm text-muted-foreground">Secuencia: <strong>{sequence.join(' - ')}</strong></p>
            <p className="text-sm text-muted-foreground">Tu respuesta: <strong>{input.join(' - ')}</strong></p>
          </motion.div>
          <Button onClick={start} className="rounded-xl px-8 bg-cyan-600 hover:bg-cyan-700">Intentar de nuevo</Button>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="bg-cyan-50 border border-cyan-200 rounded-3xl p-6">
            <p className="text-5xl mb-2">🏆</p>
            <p className="text-2xl font-serif text-foreground">¡Completaste todos los niveles!</p>
            <p className="text-sm text-muted-foreground mt-2">Llegaste a {LEVELS[LEVELS.length-1]} dígitos</p>
          </motion.div>
          <Button onClick={start} className="rounded-xl px-8 bg-cyan-600 hover:bg-cyan-700">Jugar de nuevo</Button>
        </div>
      )}
    </div>
  );
}
