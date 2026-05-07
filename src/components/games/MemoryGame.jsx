import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const COLORS = [
  { id: 0, bg: 'bg-rose-400', active: 'bg-rose-200', label: '🔴' },
  { id: 1, bg: 'bg-blue-400', active: 'bg-blue-200', label: '🔵' },
  { id: 2, bg: 'bg-emerald-400', active: 'bg-emerald-200', label: '🟢' },
  { id: 3, bg: 'bg-amber-400', active: 'bg-amber-200', label: '🟡' },
];

export default function MemoryGame() {
  const [phase, setPhase] = useState('idle'); // idle | showing | input | done
  const [sequence, setSequence] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [activeIdx, setActiveIdx] = useState(null);
  const [level, setLevel] = useState(1);
  const [best, setBest] = useState(0);
  const [wrong, setWrong] = useState(false);

  function startGame() {
    const seq = [Math.floor(Math.random() * 4)];
    setSequence(seq);
    setUserSeq([]);
    setLevel(1);
    setWrong(false);
    showSequence(seq);
  }

  function showSequence(seq) {
    setPhase('showing');
    let i = 0;
    const interval = setInterval(() => {
      setActiveIdx(seq[i]);
      setTimeout(() => setActiveIdx(null), 500);
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('input'), 800);
      }
    }, 900);
  }

  function handleTap(id) {
    if (phase !== 'input') return;
    const newUserSeq = [...userSeq, id];
    setUserSeq(newUserSeq);
    setActiveIdx(id);
    setTimeout(() => setActiveIdx(null), 200);

    const pos = newUserSeq.length - 1;
    if (newUserSeq[pos] !== sequence[pos]) {
      setWrong(true);
      setPhase('done');
      return;
    }

    if (newUserSeq.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      if (nextLevel - 1 > best) setBest(nextLevel - 1);
      const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(nextSeq);
      setUserSeq([]);
      setTimeout(() => showSequence(nextSeq), 600);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-left max-w-xs">
            <p className="font-semibold text-foreground mb-2">Memoria de trabajo</p>
            <p className="text-muted-foreground">Memorizá la secuencia de colores y repetila. Cada ronda suma uno más. Entrenás la memoria de trabajo y la atención ejecutiva.</p>
          </div>
          {best > 0 && <p className="text-xs text-muted-foreground">Mejor: nivel {best}</p>}
          <Button onClick={startGame} className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700">Iniciar</Button>
        </div>
      )}

      {(phase === 'showing' || phase === 'input') && (
        <>
          <div className="flex justify-between w-full px-1 text-sm">
            <span className="text-muted-foreground">Nivel {level}</span>
            <span className="text-muted-foreground">{phase === 'showing' ? 'Observá...' : 'Tu turno'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            {COLORS.map(c => (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleTap(c.id)}
                className={`h-28 rounded-3xl border-2 border-transparent transition-all duration-150 text-3xl flex items-center justify-center
                  ${activeIdx === c.id ? c.active + ' scale-95' : c.bg}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{userSeq.length}/{sequence.length} correctos</p>
        </>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-5 w-full">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
            <p className="text-4xl font-serif">{level - 1}</p>
            <p className="text-sm text-muted-foreground mt-1">nivel alcanzado</p>
            {best > 0 && <p className="text-xs text-muted-foreground mt-2">Mejor marca: {best}</p>}
          </motion.div>
          <Button onClick={startGame} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700">Jugar de nuevo</Button>
        </div>
      )}
    </div>
  );
}