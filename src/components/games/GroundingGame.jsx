import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const STEPS = [
  { number: 5, sense: 'VER', instruction: 'Nombrá 5 cosas que podés VER ahora mismo', emoji: '👀', color: 'bg-sky-50 border-sky-200', text: 'text-sky-700' },
  { number: 4, sense: 'TOCAR', instruction: 'Nombrá 4 cosas que podés TOCAR o sentir físicamente', emoji: '🤲', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  { number: 3, sense: 'ESCUCHAR', instruction: 'Nombrá 3 cosas que podés ESCUCHAR', emoji: '👂', color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  { number: 2, sense: 'OLER', instruction: 'Nombrá 2 cosas que podés OLER (o recordar)', emoji: '👃', color: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
  { number: 1, sense: 'SABOREAR', instruction: 'Nombrá 1 cosa que podés SABOREAR', emoji: '👅', color: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
];

export default function GroundingGame() {
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [stepIdx, setStepIdx] = useState(0);
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const step = STEPS[stepIdx];
  const remaining = step ? step.number - items.length : 0;

  function start() {
    setPhase('playing');
    setStepIdx(0);
    setItems([]);
    setInput('');
  }

  function addItem() {
    if (!input.trim()) return;
    const newItems = [...items, input.trim()];
    setItems(newItems);
    setInput('');
    if (newItems.length >= step.number) {
      setTimeout(() => {
        if (stepIdx + 1 >= STEPS.length) {
          setPhase('done');
        } else {
          setStepIdx(s => s + 1);
          setItems([]);
        }
      }, 400);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-left max-w-xs mx-auto">
            <p className="font-semibold text-foreground mb-2">Técnica 5-4-3-2-1</p>
            <p className="text-muted-foreground">Una de las herramientas más efectivas para salir de la ansiedad y volver al presente. Activás los 5 sentidos para anclar el sistema nervioso.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-emerald-600 hover:bg-emerald-700">Iniciar</Button>
        </div>
      )}

      {phase === 'playing' && step && (
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className={`border-2 rounded-3xl p-5 ${step.color}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{step.emoji}</span>
              <div>
                <p className={`font-bold text-lg ${step.text}`}>{step.number} cosas para {step.sense}</p>
                <p className="text-sm text-muted-foreground">{step.instruction}</p>
              </div>
            </div>

            {/* Items listed */}
            <div className="space-y-1.5 mb-4">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {item}
                </motion.div>
              ))}
              {Array.from({ length: remaining }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground/50">
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">{items.length + i + 1}</span>
                  ...
                </div>
              ))}
            </div>

            {remaining > 0 && (
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  placeholder={`${remaining} más...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addItem()}
                  autoFocus
                />
                <Button onClick={addItem} size="sm" className="rounded-xl">+</Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
            <p className="text-4xl mb-2">🌿</p>
            <p className="font-serif text-xl text-foreground">Sistema anclado</p>
            <p className="text-sm text-muted-foreground mt-2">Completaste los 5 sentidos. Tu sistema nervioso está más presente y regulado.</p>
          </div>
          <Button onClick={start} variant="outline" className="w-full rounded-xl">Repetir</Button>
        </motion.div>
      )}
    </div>
  );
}