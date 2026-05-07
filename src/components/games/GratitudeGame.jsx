import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const PROMPTS = [
  '¿Qué persona te alegra tener en tu vida hoy?',
  '¿Qué parte de tu cuerpo te está funcionando bien?',
  '¿Qué aprendiste esta semana?',
  '¿Qué momento del día de hoy fue positivo?',
  '¿Qué capacidad tuya valorás?',
  '¿Qué lugar te genera bienestar?',
  '¿Qué pequeña cosa te alegró hoy?',
];

export default function GratitudeGame() {
  const [phase, setPhase] = useState('idle');
  const [promptIdx, setPromptIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const ROUNDS = 3;

  function start() {
    const shuffled = [...PROMPTS].sort(() => Math.random() - 0.5).slice(0, ROUNDS);
    setAnswers([]);
    setPromptIdx(0);
    setInput('');
    setPhase('playing');
    // store shuffled prompts
    window._gratitudePrompts = shuffled;
  }

  const prompts = window._gratitudePrompts || PROMPTS.slice(0, ROUNDS);
  const currentPrompt = prompts[promptIdx];

  function submit() {
    if (!input.trim()) return;
    const newAnswers = [...answers, { prompt: currentPrompt, answer: input.trim() }];
    setAnswers(newAnswers);
    setInput('');
    if (promptIdx + 1 >= ROUNDS) {
      setPhase('done');
    } else {
      setPromptIdx(p => p + 1);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-sm text-left max-w-xs mx-auto">
            <p className="font-semibold text-foreground mb-2">Diario de gratitud</p>
            <p className="text-muted-foreground">La gratitud activa el sistema de recompensa y regula el cortisol. 3 preguntas, 3 respuestas honestas.</p>
          </div>
          <Button onClick={start} className="rounded-xl px-8 bg-rose-500 hover:bg-rose-600">Iniciar</Button>
        </div>
      )}

      {phase === 'playing' && (
        <AnimatePresence mode="wait">
          <motion.div key={promptIdx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{promptIdx + 1} de {ROUNDS}</span>
              <span>{'●'.repeat(promptIdx + 1)}{'○'.repeat(ROUNDS - promptIdx - 1)}</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
              <p className="text-base font-medium text-foreground leading-snug">{currentPrompt}</p>
            </div>
            <textarea
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-ring resize-none"
              rows={3}
              placeholder="Escribí tu respuesta..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <Button onClick={submit} disabled={!input.trim()} className="w-full rounded-xl bg-rose-500 hover:bg-rose-600">
              {promptIdx + 1 < ROUNDS ? 'Siguiente →' : 'Finalizar'}
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="text-center bg-rose-50 border border-rose-200 rounded-3xl p-5">
            <p className="text-3xl mb-2">🌸</p>
            <p className="font-serif text-xl text-foreground">Bien hecho</p>
            <p className="text-sm text-muted-foreground mt-1">Activaste el circuito de bienestar del cerebro</p>
          </div>
          {answers.map((a, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{a.prompt}</p>
              <p className="text-sm text-foreground font-medium">{a.answer}</p>
            </div>
          ))}
          <Button onClick={start} variant="outline" className="w-full rounded-xl">Otra ronda</Button>
        </motion.div>
      )}
    </div>
  );
}