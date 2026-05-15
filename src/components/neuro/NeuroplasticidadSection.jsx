import React, { useState } from 'react';
import { Brain, Zap, Sun, Wind, Activity, ChevronDown, ChevronUp } from 'lucide-react';

const CARDS = [
  {
    id: 'neuroplasticidad',
    icon: Brain,
    color: '#6B5B95',
    bg: '#6B5B9515',
    title: 'Ejercicio y Neuroplasticidad',
    description: 'El cerebro cambia cuando entrenas.',
    content: 'La neuroplasticidad es la capacidad del cerebro para adaptarse y crear nuevas conexiones neuronales. El ejercicio estimula este proceso aumentando:',
    bullets: ['BDNF (factor neurotrófico cerebral)', 'irrigación sanguínea cerebral', 'formación de nuevas neuronas'],
    result: {
      label: 'Resultado',
      items: ['🧠 memoria', '🧠 aprendizaje', '🧠 concentración', '🧠 claridad mental'],
    },
    conclusion: 'El movimiento es una forma directa de entrenar el cerebro.',
  },
  {
    id: 'dopamina',
    icon: Zap,
    color: '#E9A820',
    bg: '#E9A82015',
    title: 'Ejercicio y Dopamina',
    description: 'La dopamina es el neurotransmisor de la motivación.',
    content: 'Se libera cuando realizamos actividades que el cerebro interpreta como positivas o desafiantes. El ejercicio físico aumenta la liberación de dopamina, lo que genera:',
    bullets: ['⚡ sensación de logro', '⚡ motivación para repetir la actividad', '⚡ energía mental', '⚡ foco'],
    conclusion: 'El movimiento activa el sistema de recompensa del cerebro.',
  },
  {
    id: 'serotonina',
    icon: Sun,
    color: '#2A9D8F',
    bg: '#2A9D8F15',
    title: 'Ejercicio y Serotonina',
    description: 'La serotonina es un neurotransmisor clave para el bienestar emocional.',
    content: 'El ejercicio aumenta su disponibilidad en el cerebro. Esto produce:',
    bullets: ['😌 mejor estado de ánimo', '😌 mayor estabilidad emocional', '😌 sensación de calma', '😌 mejor calidad del sueño'],
    conclusion: 'Por eso el ejercicio es una de las herramientas más efectivas para mejorar el equilibrio emocional.',
  },
  {
    id: 'estres',
    icon: Wind,
    color: '#457B9D',
    bg: '#457B9D15',
    title: 'Ejercicio y Estrés',
    description: 'El estrés activa el sistema nervioso de alerta (simpático).',
    content: 'Cuando el estrés se mantiene demasiado tiempo puede afectar energía, sueño, digestión y estado emocional. El ejercicio ayuda a regular el estrés porque:',
    bullets: ['✔ reduce cortisol', '✔ libera tensión muscular', '✔ activa neurotransmisores calmantes', '✔ mejora la regulación emocional'],
    conclusion: 'El movimiento funciona como una válvula natural de descarga del estrés.',
  },
  {
    id: 'sistema_nervioso',
    icon: Activity,
    color: '#E07A5F',
    bg: '#E07A5F15',
    title: 'Ejercicio y Sistema Nervioso',
    description: 'El ejercicio ayuda a regular el equilibrio del sistema nervioso.',
    content: 'Entrenar activa el sistema simpático (energía y acción) pero también favorece la recuperación del sistema parasimpático. Esto mejora:',
    bullets: ['⚡ capacidad de activación', '😌 capacidad de relajación', '🧠 resiliencia al estrés', '💤 recuperación y sueño'],
    conclusion: 'Un sistema nervioso entrenado es más flexible y adaptativo.',
  },
];

const MICROLEARNINGS = [
  {
    title: 'El ejercicio cambia el cerebro',
    content: 'Durante el ejercicio el cerebro produce sustancias que favorecen la salud neuronal.',
    highlights: [
      { label: 'Dopamina', desc: 'aumenta la motivación y la energía mental.' },
      { label: 'Serotonina', desc: 'mejora el estado de ánimo y la regulación emocional.' },
      { label: 'BDNF', desc: 'estimula la creación de nuevas conexiones neuronales.' },
    ],
    benefits: ['🧠 memoria', '🧠 aprendizaje', '🧠 claridad mental', '🧠 motivación'],
    closing: 'Mover el cuerpo es también entrenar el cerebro.',
  },
  {
    title: 'El movimiento alimenta al cerebro',
    content: 'El cerebro consume aproximadamente 20% de la energía del cuerpo. El ejercicio aumenta el flujo sanguíneo cerebral, el oxígeno disponible y el aporte de nutrientes.',
    highlights: [
      { label: 'Hipocampo', desc: 'memoria' },
      { label: 'Corteza prefrontal', desc: 'decisiones' },
      { label: 'Sistema límbico', desc: 'emociones' },
    ],
    benefits: ['✔ mayor claridad mental', '✔ mejor humor', '✔ más energía'],
    closing: 'Por eso después de entrenar muchas personas sienten beneficios inmediatos.',
  },
  {
    title: 'Ejercicio y Salud Mental',
    content: 'El ejercicio es una de las herramientas más estudiadas para mejorar la salud mental. La actividad física regular puede ayudar a reducir ansiedad, estrés y fatiga mental.',
    highlights: [
      { label: 'Regula neurotransmisores', desc: '' },
      { label: 'Reduce inflamación cerebral', desc: '' },
      { label: 'Mejora el sueño', desc: '' },
    ],
    benefits: ['✔ reduce ansiedad', '✔ reduce estrés', '✔ reduce síntomas depresivos', '✔ fortalece resiliencia emocional'],
    closing: 'El cuerpo y el cerebro funcionan como un solo sistema.',
  },
  {
    title: 'Entrenar también es entrenar la mente',
    content: 'El entrenamiento físico no solo desarrolla músculos. También desarrolla capacidades mentales.',
    highlights: [
      { label: '💪 Disciplina', desc: '' },
      { label: '🎯 Foco', desc: '' },
      { label: '🔥 Tolerancia al esfuerzo', desc: '' },
      { label: '🧠 Resiliencia', desc: '' },
    ],
    benefits: [],
    closing: 'Cada sesión le envía al cerebro un mensaje claro: "puedo adaptarme y mejorar".',
  },
];

function NeuroCard({ card }) {
  const [open, setOpen] = useState(false);
  const Icon = card.icon;
  return (
    <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(38,70,83,0.06)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: card.bg }}>
          <Icon className="w-6 h-6" style={{ color: card.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: '15px', fontWeight: 800, color: '#264653' }}>{card.title}</p>
          <p style={{ fontSize: '12px', color: '#6C757D', marginTop: '2px' }}>{card.description}</p>
        </div>
        {open
          ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: '#ADB5BD' }} />
          : <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#ADB5BD' }} />}
      </button>

      {open && (
        <div className="border-t border-[#E9ECEF] px-5 pb-5 pt-4 space-y-3">
          <p style={{ fontSize: '13px', color: '#6C757D', lineHeight: 1.6 }}>{card.content}</p>
          <div className="space-y-1.5">
            {card.bullets.map((b, i) => (
              <p key={i} style={{ fontSize: '13px', color: '#264653' }}>• {b}</p>
            ))}
          </div>
          {card.result && (
            <div className="rounded-xl p-4" style={{ background: card.bg }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: card.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {card.result.label}
              </p>
              <div className="space-y-1">
                {card.result.items.map((item, i) => (
                  <p key={i} style={{ fontSize: '13px', color: '#264653' }}>{item}</p>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-xl px-4 py-3" style={{ background: '#264653' }}>
            <p style={{ fontSize: '13px', color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{card.conclusion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MicrolearningCard({ ml, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#264653', boxShadow: '0 2px 12px rgba(38,70,83,0.1)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E9C46A20' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#E9C46A' }}>{index + 1}</span>
        </div>
        <div className="flex-1">
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{ml.title}</p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />}
      </button>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-3">
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{ml.content}</p>
          {ml.highlights.length > 0 && (
            <div className="space-y-2">
              {ml.highlights.map((h, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#E9C46A', flexShrink: 0 }}>{h.label}</span>
                  {h.desc && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{h.desc}</span>}
                </div>
              ))}
            </div>
          )}
          {ml.benefits.length > 0 && (
            <div className="space-y-1">
              {ml.benefits.map((b, i) => (
                <p key={i} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{b}</p>
              ))}
            </div>
          )}
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#E9C46A', marginTop: '4px' }}>{ml.closing}</p>
        </div>
      )}
    </div>
  );
}

export default function NeuroplasticidadSection() {
  return (
    <div className="px-4 py-4 space-y-3">
      {/* Header */}
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #264653, #6B5B95)' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#E9C46A', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
          🧠 Neuroplasticidad
        </p>
        <p style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>Adaptación cerebral</p>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
          El ejercicio no solo transforma el cuerpo. Transforma el cerebro.
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', lineHeight: 1.6 }}>
          Cada vez que nos movemos se activan procesos de neuroplasticidad, regulación emocional y producción de neurotransmisores que influyen en:
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['estado de ánimo', 'motivación', 'concentración', 'memoria', 'resiliencia al estrés'].map((tag, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Cards */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#264653', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Ejercicio y cerebro
      </p>
      {CARDS.map(card => <NeuroCard key={card.id} card={card} />)}

      {/* Microlearnings */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#264653', letterSpacing: '2px', textTransform: 'uppercase', paddingTop: '8px' }}>
        Microaprendizajes
      </p>
      {MICROLEARNINGS.map((ml, i) => <MicrolearningCard key={i} ml={ml} index={i} />)}

      <div style={{ height: '8px' }} />
    </div>
  );
}