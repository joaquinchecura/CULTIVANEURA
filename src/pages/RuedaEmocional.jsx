import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionWheel from '@/components/emotionalwheel/EmotionWheel';
import { EMOTIONS, EMOTIONS_MAP, CATEGORY_LABELS } from '@/components/emotionalwheel/emotions';
import { Button } from '@/components/ui/button';

const saveCheckin = (data) => {
  const checkins = JSON.parse(localStorage.getItem('neura_emotional_checkins') || '[]');
  checkins.unshift({ ...data, id: Math.random().toString(36).slice(2), created_at: new Date().toISOString() });
  localStorage.setItem('neura_emotional_checkins', JSON.stringify(checkins));
};

export default function RuedaEmocional() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=wheel, 1=intensity, 2=techniques
  const [selectedId, setSelectedId] = useState(null);
  const [intensity, setIntensity] = useState(2);
  const [completedTechnique, setCompletedTechnique] = useState(null);

  const emotion = selectedId ? EMOTIONS_MAP[selectedId] : null;
  const today = format(new Date(), 'yyyy-MM-dd');

  function handleSelectEmotion(id) {
    setSelectedId(id);
    setIntensity(2);
    setStep(1);
  }

  function handleContinue() { setStep(2); }

  function handleBack() {
    if (step === 2) setStep(1);
    else if (step === 1) { setStep(0); setSelectedId(null); }
    else navigate(-1);
  }

  async function handleSave(techniqueId = null) {
    const technique = techniqueId ? emotion.techniques.find(t => t.id === techniqueId) : null;
    saveCheckin({
      emotion_id: selectedId,
      emotion_name: emotion.name,
      emotion_emoji: emotion.emoji,
      emotion_color: emotion.color,
      intensity,
      intensity_label: emotion.intensities[intensity],
      technique_id: technique?.id || null,
      technique_name: technique?.name || null,
      date: today,
    });
    navigate('/rueda-dashboard');
  }

  const STEP_TITLES = ['¿Cómo te sentís?', 'Intensidad', 'Técnicas sugeridas'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--app-bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 flex items-center justify-between" style={{ height: '56px' }}>
        <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground tracking-wide">RUEDA EMOCIONAL</p>
          <p className="text-xs text-muted-foreground">{STEP_TITLES[step]}</p>
        </div>
        <button onClick={() => navigate('/rueda-dashboard')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted">
          <BarChart3 className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1.5 justify-center py-3">
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === step ? '20px' : '6px', height: '6px', borderRadius: '3px',
            background: i === step ? (emotion?.color || 'var(--primary)') : 'var(--muted)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div className="px-5 pb-8 max-w-lg mx-auto">
        <AnimatePresence mode="wait">

          {/* Step 0 — Wheel */}
          {step === 0 && (
            <motion.div key="wheel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <p className="text-center text-2xl font-serif font-bold text-foreground mb-1">¿Cómo te sentís ahora?</p>
              <p className="text-center text-sm text-muted-foreground mb-4">Tocá una emoción en la rueda</p>
              <EmotionWheel selectedId={selectedId} onSelect={handleSelectEmotion} />
              {/* Quick select grid */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {EMOTIONS.map(e => (
                  <button key={e.id} onClick={() => handleSelectEmotion(e.id)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all"
                    style={{
                      background: selectedId === e.id ? `${e.color}22` : 'transparent',
                      borderColor: selectedId === e.id ? `${e.color}60` : 'var(--border)',
                    }}>
                    <span style={{ fontSize: '20px' }}>{e.emoji}</span>
                    <span className="text-[9px] font-semibold" style={{ color: selectedId === e.id ? e.color : 'var(--muted-foreground)' }}>
                      {e.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1 — Intensity */}
          {step === 1 && emotion && (
            <motion.div key="intensity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl"
                  style={{ background: `${emotion.color}22`, border: `2px solid ${emotion.color}60` }}>
                  {emotion.emoji}
                </div>
                <p className="text-2xl font-serif font-bold text-foreground">{emotion.name}</p>
                <p className="text-sm text-muted-foreground text-center">{emotion.description}</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">¿Qué intensidad?</p>
                {emotion.intensities.map((label, i) => (
                  <button key={i} onClick={() => setIntensity(i)}
                    className="w-full py-3.5 px-5 rounded-2xl border-2 flex items-center justify-between transition-all"
                    style={{
                      background: intensity === i ? `${emotion.color}15` : 'var(--card)',
                      borderColor: intensity === i ? emotion.color : 'var(--border)',
                    }}>
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(d => (
                        <div key={d} className="w-2.5 h-2.5 rounded-full transition-all"
                          style={{ background: d <= i ? emotion.color : 'var(--muted)' }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <Button onClick={handleContinue} className="w-full rounded-2xl py-6 text-white font-bold"
                style={{ background: emotion.color }}>
                Ver técnicas sugeridas →
              </Button>
            </motion.div>
          )}

          {/* Step 2 — Techniques */}
          {step === 2 && emotion && (
            <motion.div key="techniques" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              {/* Emotion summary */}
              <div className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: `${emotion.color}15`, border: `1px solid ${emotion.color}30` }}>
                <span style={{ fontSize: '40px' }}>{emotion.emoji}</span>
                <div>
                  <p className="text-lg font-bold text-foreground">{emotion.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {emotion.intensities[intensity]} · {['Suave', 'Moderada', 'Intensa'][intensity]}
                  </p>
                </div>
              </div>

              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Técnicas recomendadas</p>

              <div className="space-y-3">
                {emotion.techniques.map(tech => {
                  const cat = CATEGORY_LABELS[tech.category];
                  return (
                    <motion.div key={tech.id} whileTap={{ scale: 0.98 }}
                      className="rounded-2xl p-4 border bg-card cursor-pointer hover:shadow-md transition-all"
                      style={{ borderColor: completedTechnique === tech.id ? tech.color : 'var(--border)' }}
                      onClick={() => setCompletedTechnique(tech.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: `${tech.color}20` }}>
                          {tech.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-foreground">{tech.name}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                              style={{ background: `${cat.color}20`, color: cat.color }}>
                              {cat.emoji} {cat.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{tech.description}</p>
                          <p className="text-xs font-medium mt-1" style={{ color: tech.color }}>⏱ {tech.duration}</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: completedTechnique === tech.id ? tech.color : 'var(--border)', background: completedTechnique === tech.id ? tech.color : 'transparent' }}>
                          {completedTechnique === tech.id && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-2">
                <Button onClick={() => handleSave(completedTechnique)}
                  className="w-full rounded-2xl py-5 text-white font-bold"
                  style={{ background: emotion.color }}>
                  {completedTechnique ? '✓ Guardar con técnica' : 'Guardar emoción'}
                </Button>
                <button onClick={() => handleSave(null)}
                  className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Solo registrar sin técnica
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
