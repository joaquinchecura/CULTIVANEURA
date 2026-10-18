import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckInWizard from '@/components/neuro/CheckInWizard';
import DiagnosisCard from '@/components/neuro/DiagnosisCard';
import NuanceWheel from '@/components/equilibrio/NuanceWheel';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowLeft, Check, FileDown, TrendingUp, AlertCircle, ShieldCheck, BatteryLow, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useUser } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import { LS_KEYS, lsCreate, lsFilter, todayKey } from '@/lib/storage';
import { NS_CONFIG } from '@/lib/nervous-system';
import { generarPDFSemanal } from '@/lib/pdf';

// ─── Diccionarios de labels ───────────────────────────────────────────────────
const EMOTION_LABELS = {
  ansiedad: 'Ansiedad', calma: 'Calma', frustracion: 'Frustración',
  apatia: 'Apatía', motivacion: 'Motivación',
};
const MIND_LABELS = {
  clara: 'Clara', dispersa: 'Dispersa', rumiando: 'Rumiando', enfocada: 'Enfocada',
};

// ─── Sistema data ──────────────────────────────────────────────────────────────
const SYSTEM_STATES = [
  {
    id: 'high',
    name: 'Activación Alta',
    icon: <AlertCircle size={28} />,
    color: '#D94A4A',
    bgSoft: 'bg-rose-50 text-rose-600',
    activationLevel: 3,
    sensations: ['Tensión', 'Agitación', 'Prisa'],
    nuances: [
      { name: 'Ira',          emoji: '😠', response: 'canalizar', learning: 'La energía intensa puede canalizarse en movimiento estructurado.' },
      { name: 'Ansiedad',     emoji: '😰', response: 'regular',   learning: 'Cuando el cuerpo está alerta, el movimiento consciente ayuda a regularlo.' },
      { name: 'Anticipación', emoji: '🤔', response: 'enfocar',   learning: 'La expectativa puede enfocarse en acciones concretas.' },
    ],
    adaptations: {
      movement:  '• Volumen: 60% habitual\n• Tempo: Lento controlado\n• Pausas: Más frecuentes\n• Enfoque: Respiración consciente',
      nutrition: 'Priorizá comidas estables y ricas en proteínas y fibra para estabilizar la energía.',
      rehab:     '5 min de movilidad cervical + respiración guiada 4-7-8.',
      rest:      'Rutina de descarga nocturna disponible post-entreno.',
    },
  },
  {
    id: 'regulated',
    name: 'Regulado',
    icon: <ShieldCheck size={28} />,
    color: '#4A9D54',
    bgSoft: 'bg-emerald-50 text-emerald-600',
    activationLevel: 2,
    sensations: ['Equilibrio', 'Energía estable', 'Claridad'],
    nuances: [
      { name: 'Alegría',   emoji: '😊', response: 'fortalecer', learning: 'La energía positiva es un buen momento para fortalecer.' },
      { name: 'Confianza', emoji: '🤝', response: 'expandir',   learning: 'La estabilidad emocional permite progresar con seguridad.' },
      { name: 'Calma',     emoji: '😌', response: 'sostener',   learning: 'La calma es el mejor estado para el aprendizaje motor.' },
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
    icon: <BatteryLow size={28} />,
    color: '#8C7B6B',
    bgSoft: 'bg-stone-100 text-stone-600',
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

// ─── Sub-components ───────────────────────────────────────────────────────────
function IntensitySelector({ state, nuance, intensity, onChange, onConfirm, onBack }) {
  const levels = [
    { value: 1, label: 'Leve',     dots: 1, desc: 'Lo noto pero no me condiciona.' },
    { value: 2, label: 'Moderado', dots: 2, desc: 'Está presente y me influye.' },
    { value: 3, label: 'Intenso',  dots: 3, desc: 'Es dominante en este momento.' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: `${state.color}15`, border: `1px solid ${state.color}30` }}>
        <span style={{ fontSize: '32px' }}>{nuance.emoji}</span>
        <div>
          <p className="text-base font-semibold text-foreground">{nuance.name}</p>
          <p className="text-xs text-muted-foreground">{state.name}</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">¿Qué intensidad tiene?</p>

      <div className="space-y-2.5">
        {levels.map(lvl => (
          <button key={lvl.value} onClick={() => onChange(lvl.value)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all text-left"
            style={{
              background:   intensity === lvl.value ? `${state.color}15` : 'var(--card)',
              borderColor:  intensity === lvl.value ? state.color : 'var(--border)',
            }}>
            <div>
              <p className="text-sm font-semibold text-foreground">{lvl.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lvl.desc}</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(d => (
                <div key={d} className="w-3 h-3 rounded-full transition-all" style={{ background: d <= lvl.value ? state.color : 'var(--muted)' }} />
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90" style={{ background: state.color }}>
          Ver adaptaciones
        </button>
      </div>
    </div>
  );
}

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
      <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: `${state.color}15`, border: `1px solid ${state.color}30` }}>
        <span style={{ fontSize: '36px' }}>{nuance.emoji}</span>
        <div>
          <p className="text-base font-semibold text-foreground">{nuance.name} · {state.name}</p>
          <p className="text-xs text-muted-foreground">{intensityLabel} · Tu día adaptado</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-100">
        <p className="text-xs font-semibold mb-1.5 text-emerald-700 flex items-center gap-1.5"><Lightbulb size={14} /> Para recordar</p>
        <p className="text-sm leading-relaxed text-emerald-900/80">{nuance.learning}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ADAPT_CONFIG.map(({ key, emoji, label }) => (
          <div key={key} className="rounded-2xl p-4 border bg-card" style={{ borderColor: 'var(--border)' }}>
            <p className="text-base mb-1.5">{emoji}</p>
            <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{state.adaptations[key]}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button onClick={onSave} disabled={saving} className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: state.color }}>
          {saving ? '...' : <><Check className="w-4 h-4" /> Guardar</>}
        </button>
      </div>
    </div>
  );
}

function SistemaComplete({ state, nuance, onReset }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-5 py-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: `${state.color}22`, border: `2px solid ${state.color}60` }}>
        {nuance.emoji}
      </div>
      <div>
        <p className="text-xl font-serif text-foreground">Check-in guardado</p>
        <p className="text-sm text-muted-foreground mt-1">{nuance.name} · {state.name}</p>
      </div>
      <button onClick={onReset} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <RotateCcw className="w-4 h-4" /> Nuevo check-in
      </button>
    </motion.div>
  );
}

// ─── SistemaFlow ──────────────────────────────────────────────────────────────
function SistemaFlow({ userEmail, initialNervousSystem }) {
  const initialSystemState = initialNervousSystem 
    ? SYSTEM_STATES.find(s => {
        if (initialNervousSystem === 'regulado') return s.id === 'regulated';
        if (initialNervousSystem === 'activado') return s.id === 'high';
        if (initialNervousSystem === 'colapsado') return s.id === 'low';
        return false;
      })
    : null;

  const [step, setStep] = useState(initialSystemState ? 'nuance' : 'state');
  const [selectedState, setSelectedState] = useState(initialSystemState);
  const [selectedNuance, setSelectedNuance] = useState(null);
  const [intensity, setIntensity] = useState(2);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function reset() {
    setStep(initialSystemState ? 'nuance' : 'state'); 
    setSelectedState(initialSystemState);
    setSelectedNuance(null); 
    setIntensity(2); 
    setDone(false);
  }

  function handleSave() {
    if (!userEmail || !selectedState || !selectedNuance) return;
    setSaving(true);
    try {
      lsCreate(LS_KEYS.SISTEMA, {
        stateId: selectedState.id, stateName: selectedState.name, stateColor: selectedState.color,
        nuanceName: selectedNuance.name, nuanceEmoji: selectedNuance.emoji, intensity,
        user_email: userEmail, date: todayKey(), completed: true,
      });
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  if (done) return <SistemaComplete state={selectedState} nuance={selectedNuance} onReset={reset} />;

  return (
    <AnimatePresence mode="wait">
      {step === 'state' && (
        <motion.div key="state" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-4">
            Antes de mover el cuerpo, escuchémoslo
          </p>
          {SYSTEM_STATES.map(state => (
            <motion.button
              key={state.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedState(state); setStep('nuance'); }}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border bg-card text-left transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className={cn("w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0", state.bgSoft)}>
                {state.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-foreground">{state.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{state.sensations.join(' · ')}</p>
              </div>
              <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: `${state.color}66` }} />
            </motion.button>
          ))}
        </motion.div>
      )}

      {step === 'nuance' && selectedState && (
        <motion.div key="nuance" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
          <NuanceWheel state={selectedState} selectedNuance={selectedNuance} onSelect={n => { setSelectedNuance(n); setIntensity(2); }} />
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setStep(initialSystemState ? 'nuance' : 'state'); setSelectedState(initialSystemState); setSelectedNuance(null); }} className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            {selectedNuance && (
              <button onClick={() => setStep('intensity')} className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90" style={{ background: selectedState.color }}>
                Continuar →
              </button>
            )}
          </div>
        </motion.div>
      )}

      {step === 'intensity' && selectedState && selectedNuance && (
        <motion.div key="intensity" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
          <IntensitySelector state={selectedState} nuance={selectedNuance} intensity={intensity} onChange={setIntensity} onConfirm={() => setStep('adaptations')} onBack={() => setStep('nuance')} />
        </motion.div>
      )}

      {step === 'adaptations' && selectedState && selectedNuance && (
        <motion.div key="adaptations" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
          <AdaptationSummary state={selectedState} nuance={selectedNuance} intensity={intensity} onSave={handleSave} onBack={() => setStep('intensity')} saving={saving} />
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

export default function Estado() {
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState('checkin');
  const [showSystemFlow, setShowSystemFlow] = useState(false);

  const [checkIn,  setCheckIn]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [done,     setDone]     = useState(false);
  const [history,  setHistory]  = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [lastCheckin, setLastCheckin] = useState(null);

  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  useEffect(() => {
    if (!userEmail) return;
    const items = lsFilter(LS_KEYS.CHECKINS, { user_email: userEmail }, 5);
    setHistory(items);
    setLastCheckin(items.length > 0 ? items[0] : null);
  }, [userEmail, done]);

  function handleComplete(data) {
    if (!userEmail) return;
    setSaving(true);
    try {
      const saved = lsCreate(LS_KEYS.CHECKINS, { ...data, user_email: userEmail, date: todayKey() });
      setCheckIn(saved);
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  function resetCheckin() { setCheckIn(null); setDone(false); }

  function handleExportPDF() {
    if (!userEmail) return;
    setPdfLoading(true);
    try {
      const allCheckins = lsFilter(LS_KEYS.CHECKINS, { user_email: userEmail }, 200);
      const allSistema  = lsFilter(LS_KEYS.SISTEMA,  { user_email: userEmail }, 200);
      generarPDFSemanal(allCheckins, allSistema, userEmail);
    } catch (e) {
      console.error('Error generando PDF:', e);
      alert('Hubo un error al generar el PDF. Revisá la consola.');
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="px-6 pt-12 pb-8">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Check-in</p>
          <h1 className="text-2xl font-serif text-foreground mt-0.5">Mi Estado</h1>
          <p className="text-sm text-muted-foreground mt-1">El núcleo de tu práctica neuro</p>
        </div>
        <button onClick={handleExportPDF} disabled={pdfLoading} className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50" title="Descargar reporte semanal PDF">
          <FileDown className="w-4 h-4" />
          {pdfLoading ? 'Generando...' : 'PDF semanal'}
        </button>
      </div>

      <div className="flex gap-1 p-1 rounded-2xl mb-6 bg-muted">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowSystemFlow(false); }} className={cn('flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all', activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'checkin' && (
          <motion.div key="checkin" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
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

            {history.length > 0 && !done && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="mt-8">
                <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-widest">Historial reciente</h2>
                <div className="space-y-2">
                  {history.map(item => {
                    const cfg = NS_CONFIG[item.nervous_system];
                    return (
                      <div key={item.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", cfg?.bgSoft)}>
                            {item.nervous_system === 'regulado' ? <ShieldCheck size={16}/> : item.nervous_system === 'activado' ? <AlertCircle size={16}/> : <BatteryLow size={16}/>}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{cfg?.label || item.nervous_system}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {EMOTION_LABELS[item.emotion] || item.emotion} · {MIND_LABELS[item.mind] || item.mind}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.date ? format(new Date(item.date + 'T00:00:00'), 'd MMM', { locale: es }) : ''}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'sistema' && (
          <motion.div key="sistema" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {!showSystemFlow && lastCheckin ? (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-3xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", NS_CONFIG[lastCheckin.nervous_system]?.bgSoft)}>
                      {lastCheckin.nervous_system === 'regulado' ? <ShieldCheck size={20}/> : lastCheckin.nervous_system === 'activado' ? <AlertCircle size={20}/> : <BatteryLow size={20}/>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Basado en tu último check-in</p>
                      <p className="text-xs text-muted-foreground">{NS_CONFIG[lastCheckin.nervous_system]?.label} · {lastCheckin.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Como estás en estado <strong>{NS_CONFIG[lastCheckin.nervous_system]?.label}</strong>, te recomendamos las adaptaciones de entrenamiento para hoy.</p>
                  <Button onClick={() => setShowSystemFlow(true)} className="w-full rounded-xl gap-2">
                    <TrendingUp size={16} /> Ver recomendaciones de entrenamiento
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {showSystemFlow && lastCheckin && (
                  <button onClick={() => setShowSystemFlow(false)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
                    <ArrowLeft size={14} /> Volver al resumen
                  </button>
                )}
                <SistemaFlow userEmail={userEmail} initialNervousSystem={lastCheckin?.nervous_system} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}