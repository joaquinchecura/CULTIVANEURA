import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckInWizard from '@/components/neuro/CheckInWizard';
import DiagnosisCard from '@/components/neuro/DiagnosisCard';
import NuanceWheel from '@/components/equilibrio/NuanceWheel';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowLeft, Check } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useUser } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';

// ─── Sistema data (from Equilibrio.jsx) ───────────────────────────────────────

const SYSTEM_STATES = [
  {
    id: 'high',
    name: 'Activación Alta',
    icon: '🔴',
    color: '#FF6B6B',
    activationLevel: 3,
    sensations: ['Tensión', 'Agitación', 'Prisa'],
    nuances: [
      { name: 'Ira',          emoji: '😠', response: 'canalizar', learning: 'La energía intensa puede canalizarse en movimiento estructurado.' },
      { name: 'Ansiedad',     emoji: '😰', response: 'regular',   learning: 'Cuando el cuerpo está alerta, el movimiento consciente ayuda a regularlo.' },
      { name: 'Anticipación', emoji: '🤔', response: 'enfocar',   learning: 'La expectativa puede enfocarse en acciones concretas.' },
    ],
    adaptations: {
      movement:   '• Volumen: 60% habitual\n• Tempo: Lento controlado\n• Pausas: Más frecuentes\n• Enfoque: Respiración consciente',
      nutrition:  'Priorizá comidas estables y ricas en proteínas y fibra para estabilizar la energía.',
      rehab:      '5 min de movilidad cervical + respiración guiada 4-7-8.',
      rest:       'Rutina de descarga nocturna disponible post-entreno.',
    },
  },
  {
    id: 'regulated',
    name: 'Regulado',
    icon: '🟢',
    color: '#6BCB77',
    activationLevel: 2,
    sensations: ['Equilibrio', 'Energía estable', 'Claridad'],
    nuances: [
      { name: 'Alegría',    emoji: '😊', response: 'fortalecer', learning: 'La energía positiva es un buen momento para fortalecer.' },
      { name: 'Confianza',  emoji: '🤝', response: 'expandir',   learning: 'La estabilidad emocional permite progresar con seguridad.' },
      { name: 'Calma',      emoji: '😌', response: 'sostener',   learning: 'La calma es el mejor estado para el aprendizaje motor.' },
    ],
    adaptations: {
      movement:  '• Volumen: Normal\n• Progresión: Avanzar en cargas\n• Enfoque: Técnica y fuerza\n• Ejercicios preventivos incluidos',
      nutrition: 'Nutrición completa y balanceada para sostener el rendimiento.',
      rehab:     'Trabajo preventivo y movilidad activa.',
      rest:      'Recuperación activa y rutinas de calidad.',
    },
  },
  {
    id: 'low',
    name: 'Activación Baja',
    icon: '🔵',
    color: '#4D96FF',
    activationLevel: 1,
    sensations: ['Pesadez', 'Lentitud', 'Niebla'],
    nuances: [
      { name: 'Tristeza', emoji: '😢', response: 'acompañar', learning: 'Moverse suavemente puede cambiar la química interna.' },
      { name: 'Apatía',   emoji: '😶', response: 'despertar',  learning: 'Pequeños movimientos despiertan al sistema.' },
      { name: 'Fatiga',   emoji: '😴', response: 'restaurar',  learning: 'El descanso activo restaura mejor que el reposo total.' },
    ],
    adaptations: {
      movement:  '• Volumen: 80% habitual\n• Activación progresiva\n• Movimientos dinámicos\n• Respiración energizante',
      nutrition: 'Estimulá con alimentos que aporten energía sostenida.',
      rehab:     'Activación estructural suave y movilidad matinal.',
      rest:      'Rutina matinal para despertar el sistema.',
    },
  },
];

// ─── Sistema inline sub-components ───────────────────────────────────────────

/** Step 1 — choose one of the 3 system states */
function StateSelector({ onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">
        Antes de mover el cuerpo, escuchémoslo
      </p>
      {SYSTEM_STATES.map(state => (
        <motion.button
          key={state.id}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(state)}
          className="w-full flex items-center gap-4 p-5 rounded-2xl border bg-card text-left transition-all hover:shadow-sm"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${state.color}22`, border: `2px solid ${state.color}55` }}
          >
            {state.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground">{state.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {state.sensations.join(' · ')}
            </p>
          </div>
          <div
            className="w-2 h-8 rounded-full flex-shrink-0"
            style={{ background: `${state.color}66` }}
          />
        </motion.button>
      ))}
    </div>
  );
}

/** Step 3 — intensity (1–3) */
function IntensitySelector({ state, nuance, intensity, onChange, onConfirm, onBack }) {
  const levels = [
    { value: 1, label: 'Leve',    dots: 1, desc: 'Lo noto pero no me condiciona.' },
    { value: 2, label: 'Moderado', dots: 2, desc: 'Está presente y me influye.' },
    { value: 3, label: 'Intenso',  dots: 3, desc: 'Es dominante en este momento.' },
  ];

  return (
    <div className="space-y-5">
      {/* State + nuance summary */}
      <div
        className="flex items-center gap-3 rounded-2xl p-4"
        style={{ background: `${state.color}15`, border: `1px solid ${state.color}30` }}
      >
        <span style={{ fontSize: '32px' }}>{nuance.emoji}</span>
        <div>
          <p className="text-base font-bold text-foreground">{nuance.name}</p>
          <p className="text-xs text-muted-foreground">{state.name}</p>
        </div>
      </div>

      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
        ¿Qué intensidad tiene?
      </p>

      <div className="space-y-2.5">
        {levels.map(lvl => (
          <button
            key={lvl.value}
            onClick={() => onChange(lvl.value)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all text-left"
            style={{
              background: intensity === lvl.value ? `${state.color}15` : 'var(--card)',
              borderColor: intensity === lvl.value ? state.color : 'var(--border)',
            }}
          >
            <div>
              <p className="text-sm font-bold text-foreground">{lvl.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lvl.desc}</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(d => (
                <div
                  key={d}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{ background: d <= lvl.value ? state.color : 'var(--muted)' }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
          style={{ background: state.color }}
        >
          Ver adaptaciones
        </button>
      </div>
    </div>
  );
}

/** Step 4 — adaptation cards + save */
function AdaptationSummary({ state, nuance, intensity, onSave, onBack, saving }) {
  const intensityLabel = ['', 'Leve', 'Moderado', 'Intenso'][intensity];

  const ADAPT_CONFIG = [
    { key: 'movement',  emoji: '💪', label: 'Movimiento' },
    { key: 'nutrition', emoji: '🥗', label: 'Nutrición' },
    { key: 'rehab',     emoji: '🔄', label: 'Rehabilitación' },
    { key: 'rest',      emoji: '😴', label: 'Descanso' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: `${state.color}15`, border: `1px solid ${state.color}30` }}
      >
        <span style={{ fontSize: '36px' }}>{nuance.emoji}</span>
        <div>
          <p className="text-base font-bold text-foreground">
            {nuance.name} · {state.name}
          </p>
          <p className="text-xs text-muted-foreground">{intensityLabel} · Tu día adaptado</p>
        </div>
      </div>

      {/* Microlearning */}
      <div className="rounded-2xl p-4" style={{ background: '#264653' }}>
        <p className="text-xs font-bold mb-1.5" style={{ color: '#E9C46A' }}>💡 Para recordar</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {nuance.learning}
        </p>
      </div>

      {/* Adaptation cards */}
      <div className="grid grid-cols-2 gap-3">
        {ADAPT_CONFIG.map(({ key, emoji, label }) => (
          <div
            key={key}
            className="rounded-2xl p-4 border bg-card"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-base mb-1.5">{emoji}</p>
            <p className="text-xs font-bold text-foreground mb-1.5">{label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{state.adaptations[key]}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: state.color }}
        >
          {saving ? '...' : <><Check className="w-4 h-4" /> Guardar</>}
        </button>
      </div>
    </div>
  );
}

/** Completion screen shown after saving */
function SistemaComplete({ state, nuance, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-5 py-8"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ background: `${state.color}22`, border: `2px solid ${state.color}60` }}
      >
        {nuance.emoji}
      </div>
      <div>
        <p className="text-xl font-serif font-bold text-foreground">Check-in guardado</p>
        <p className="text-sm text-muted-foreground mt-1">
          {nuance.name} · {state.name}
        </p>
      </div>
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw className="w-4 h-4" /> Nuevo check-in
      </button>
    </motion.div>
  );
}

/** Full Sistema flow (Equilibrio adapted) */
function SistemaFlow({ userEmail }) {
  const [step, setStep] = useState('state');       // state → nuance → intensity → adaptations → done
  const [selectedState, setSelectedState] = useState(null);
  const [selectedNuance, setSelectedNuance] = useState(null);
  const [intensity, setIntensity] = useState(2);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function reset() {
    setStep('state');
    setSelectedState(null);
    setSelectedNuance(null);
    setIntensity(2);
    setDone(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await base44.entities.DailySystemCheckin.create({
        stateId:       selectedState.id,
        stateName:     selectedState.name,
        stateColor:    selectedState.color,
        nuanceName:    selectedNuance.name,
        nuanceEmoji:   selectedNuance.emoji,
        intensity,
        user_email:    userEmail,
        date:          format(new Date(), 'yyyy-MM-dd'),
        completed:     true,
      });
      setDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return <SistemaComplete state={selectedState} nuance={selectedNuance} onReset={reset} />;
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'state' && (
        <motion.div key="state" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
          <StateSelector
            onSelect={s => { setSelectedState(s); setStep('nuance'); }}
          />
        </motion.div>
      )}

      {step === 'nuance' && selectedState && (
        <motion.div key="nuance" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
          <NuanceWheel
            state={selectedState}
            selectedNuance={selectedNuance}
            onSelect={setSelectedNuance}
          />

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => { setStep('state'); setSelectedState(null); setSelectedNuance(null); }}
              className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            {selectedNuance && (
              <button
                onClick={() => setStep('intensity')}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: selectedState.color }}
              >
                Continuar →
              </button>
            )}
          </div>
        </motion.div>
      )}

      {step === 'intensity' && selectedState && selectedNuance && (
        <motion.div key="intensity" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
          <IntensitySelector
            state={selectedState}
            nuance={selectedNuance}
            intensity={intensity}
            onChange={setIntensity}
            onConfirm={() => setStep('adaptations')}
            onBack={() => setStep('nuance')}
          />
        </motion.div>
      )}

      {step === 'adaptations' && selectedState && selectedNuance && (
        <motion.div key="adaptations" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
          <AdaptationSummary
            state={selectedState}
            nuance={selectedNuance}
            intensity={intensity}
            onSave={handleSave}
            onBack={() => setStep('intensity')}
            saving={saving}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'checkin', label: 'Check-in rápido' },
  { id: 'sistema', label: 'Estado del Sistema' },
];

const nervousLabels = { regulado: '🟢', activado: '🟡', colapsado: '🔴' };

export default function Estado() {
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState('checkin');

  // Check-in tab state (unchanged)
  const [checkIn, setCheckIn] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState([]);

  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  useEffect(() => {
    if (userEmail) {
      base44.entities.CheckIn.filter({ user_email: userEmail }, '-created_date', 5)
        .then(setHistory);
    }
  }, [userEmail]);

  async function handleComplete(data) {
    setSaving(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const saved = await base44.entities.CheckIn.create({
      ...data,
      user_email: userEmail,
      date: today,
    });
    setCheckIn(saved);
    setDone(true);
    setSaving(false);
    base44.entities.CheckIn.filter({ user_email: userEmail }, '-created_date', 5).then(setHistory);
  }

  function resetCheckin() {
    setCheckIn(null);
    setDone(false);
  }

  return (
    <div className="px-6 pt-12 pb-8">
      {/* ── Page header ── */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Check-in</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Mi Estado</h1>
        <p className="text-sm text-muted-foreground mt-1">El núcleo de tu práctica neuro</p>
      </div>

      {/* ── Tab bar ── */}
      <div
        className="flex gap-1 p-1 rounded-2xl mb-6"
        style={{ background: 'var(--muted)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all',
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">

        {/* ── Check-in rápido (existing) ── */}
        {activeTab === 'checkin' && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-card border border-border rounded-3xl p-6">
                    <CheckInWizard onComplete={handleComplete} loading={saving} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <DiagnosisCard checkIn={checkIn} />
                  <Button variant="outline" onClick={resetCheckin} className="w-full gap-2 rounded-xl">
                    <RotateCcw size={15} /> Nuevo check-in
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History */}
            {history.length > 0 && !done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                className="mt-8"
              >
                <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-widest">
                  Historial reciente
                </h2>
                <div className="space-y-2">
                  {history.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{nervousLabels[item.nervous_system] || '⚪'}</span>
                        <div>
                          <p className="text-sm font-medium capitalize">{item.nervous_system}</p>
                          <p className="text-xs text-muted-foreground capitalize">{item.emotion} · {item.mind}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.date ? format(new Date(item.date + 'T00:00:00'), 'd MMM', { locale: es }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Estado del Sistema (Equilibrio) ── */}
        {activeTab === 'sistema' && (
          <motion.div
            key="sistema"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <SistemaFlow userEmail={userEmail} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}