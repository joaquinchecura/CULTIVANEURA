import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StateCard from './StateCard';
import { cn } from '@/lib/utils';

const emotionOptions = [
  { value: 'ansiedad', label: 'Ansiedad', icon: '😰' },
  { value: 'calma', label: 'Calma', icon: '😌' },
  { value: 'frustracion', label: 'Frustración', icon: '😤' },
  { value: 'apatia', label: 'Apatía', icon: '😶' },
  { value: 'motivacion', label: 'Motivación', icon: '⚡' },
];

const bodyOptions = [
  { value: 'tension', label: 'Tensión', icon: '🔒' },
  { value: 'energia', label: 'Energía', icon: '✨' },
  { value: 'respiracion', label: 'Respiración', icon: '🌬️' },
  { value: 'digestion', label: 'Digestión', icon: '🫁' },
];

const mindOptions = [
  { value: 'clara', label: 'Clara', icon: '💡' },
  { value: 'dispersa', label: 'Dispersa', icon: '🌀' },
  { value: 'rumiando', label: 'Rumiando', icon: '💭' },
  { value: 'enfocada', label: 'Enfocada', icon: '🎯' },
];

const steps = [
  { key: 'nervous_system', title: 'Sistema Nervioso', subtitle: '¿Cómo sentís tu estado de activación?' },
  { key: 'emotion', title: 'Emoción dominante', subtitle: '¿Qué emoción está más presente ahora?' },
  { key: 'body', title: 'Tu cuerpo', subtitle: '¿Qué notás más en tu cuerpo?' },
  { key: 'mind', title: 'Tu mente', subtitle: '¿Cómo está tu mente en este momento?' },
];

function PillOption({ option, selected, onSelect }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(option.value)}
      className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all w-full',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-foreground hover:border-primary/40'
      )}
    >
      <span className="text-lg">{option.icon}</span>
      {option.label}
    </motion.button>
  );
}

export default function CheckInWizard({ onComplete, loading }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    nervous_system: '',
    emotion: '',
    body: '',
    mind: '',
  });

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  function select(key, value) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  function canAdvance() {
    return !!data[currentStep.key];
  }

  function advance() {
    if (isLast) {
      onComplete(data);
    } else {
      setStep(s => s + 1);
    }
  }

  function renderOptions() {
    if (currentStep.key === 'nervous_system') {
      return ['regulado', 'activado', 'colapsado'].map(s => (
        <StateCard
          key={s}
          state={s}
          selected={data.nervous_system === s}
          onClick={() => select('nervous_system', s)}
        />
      ));
    }
    const options = {
      emotion: emotionOptions,
      body: bodyOptions,
      mind: mindOptions,
    }[currentStep.key] || [];
    return options.map(opt => (
      <PillOption
        key={opt.value}
        option={opt}
        selected={data[currentStep.key] === opt.value}
        onSelect={v => select(currentStep.key, v)}
      />
    ));
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= step ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-xl font-serif text-foreground">{currentStep.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{currentStep.subtitle}</p>
          </div>

          <div className="space-y-2.5">
            {renderOptions()}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)} className="gap-1">
            <ChevronLeft size={16} /> Anterior
          </Button>
        )}
        <Button
          className="flex-1 gap-1"
          disabled={!canAdvance() || loading}
          onClick={advance}
        >
          {isLast ? (
            <><Check size={16} /> Ver mi diagnóstico</>
          ) : (
            <>Siguiente <ChevronRight size={16} /></>
          )}
        </Button>
      </div>
    </div>
  );
}