import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CARDS = [
  {
    id: 'por_que',
    emoji: '🌬️',
    color: '#2A9D8F',
    bg: '#2A9D8F15',
    title: '¿Por qué la respiración importa?',
    description: 'El único sistema autónomo que podés controlar.',
    content: 'La respiración es el puente entre el sistema nervioso voluntario e involuntario. Es la única función autónoma que podés controlar conscientemente — y a través de ella, influir en todo lo demás:',
    bullets: ['Respiración lenta → activa parasimpático', 'Respiración rápida → activa simpático', 'Controlar la respiración = controlar el estado del SN', 'Efecto en segundos, no en minutos'],
    conclusion: 'La respiración es el control remoto del sistema nervioso.',
  },
  {
    id: 'mecanica',
    emoji: '💨',
    color: '#52b788',
    bg: '#52b78815',
    title: 'Mecánica respiratoria',
    description: 'Cómo respiramos vs cómo deberíamos.',
    content: 'La mayoría de las personas adultas respira de manera subóptima por hábito o estrés crónico:',
    bullets: ['Respiración torácica (alta) → activa el simpático crónicamente', 'Respiración diafragmática (abdominal) → activa el parasimpático', 'Frecuencia ideal en reposo: 5-6 respiraciones por minuto', 'Frecuencia habitual promedio: 12-20 respiraciones por minuto'],
    conclusion: 'Bajar la frecuencia respiratoria a 5-6 resp/min es la intervención más simple y poderosa para el SN.',
  },
  {
    id: 'box_breathing',
    emoji: '📦',
    color: '#457B9D',
    bg: '#457B9D15',
    title: 'Box Breathing (4-4-4-4)',
    description: 'La técnica de los Navy SEALs.',
    content: 'Cuatro fases iguales de 4 segundos. Activa el nervio vago, baja el cortisol y genera foco calmado:',
    bullets: ['Inhalá: 4 segundos', 'Sostené: 4 segundos', 'Exhalá: 4 segundos', 'Sostené vacío: 4 segundos → repetir 4-6 ciclos'],
    conclusion: 'Usarla antes de situaciones de alta presión o cuando la activación es excesiva.',
  },
  {
    id: '478',
    emoji: '🌙',
    color: '#6B5B95',
    bg: '#6B5B9515',
    title: 'Respiración 4-7-8',
    description: 'Para bajar la activación rápidamente.',
    content: 'La exhalación extendida activa el nervio vago y reduce la frecuencia cardíaca. Ideal para antes de dormir o en picos de ansiedad:',
    bullets: ['Inhalá por la nariz: 4 segundos', 'Sostené: 7 segundos', 'Exhalá por la boca: 8 segundos → repetir 4 ciclos'],
    conclusion: 'La exhalación larga es el mecanismo clave — le dice al cerebro que no hay peligro.',
  },
  {
    id: 'coherente',
    emoji: '💗',
    color: '#E07A5F',
    bg: '#E07A5F15',
    title: 'Respiración coherente (5-5)',
    description: 'Sincroniza corazón y cerebro.',
    content: 'Inhalar y exhalar en 5 segundos cada una genera coherencia cardiovascular — un estado de sincronía entre el ritmo cardíaco, la respiración y las ondas cerebrales:',
    bullets: ['5 segundos inhalando + 5 segundos exhalando = 6 resp/min', 'Maximiza el HRV', 'Activa la corteza prefrontal', 'Ideal para foco, toma de decisiones y creatividad'],
    conclusion: 'La respiración coherente es la técnica más respaldada científicamente para el rendimiento cognitivo.',
  },
  {
    id: 'wim_hof',
    emoji: '❄️',
    color: '#E9C46A',
    bg: '#E9C46A15',
    title: 'Respiración activante (estilo Wim Hof)',
    description: 'Para generar energía y activación.',
    content: 'La hiperventilación controlada seguida de retención genera un estado de activación simpática intensa. Uso específico — no para relajar:',
    bullets: ['30-40 respiraciones rápidas y profundas', 'Retención post-exhalación (sin aire)', 'Inhalación profunda → retención 15 seg', 'Repetir 3-4 rondas → efecto energizante de 2-3 horas'],
    conclusion: 'Usar solo en contexto apropiado: nunca en agua, conduciendo o en posición de pie sin apoyo.',
  },
];

const MICROLEARNINGS = [
  {
    title: 'El suspiró fisiológico',
    content: 'El suspiro doble (dos inhalaciones rápidas por la nariz seguidas de una exhalación larga por la boca) es el mecanismo natural del cuerpo para re-inflar los alvéolos pulmonares y bajar rápidamente el CO2. Un solo suspiro doble puede reducir la frecuencia cardíaca y la ansiedad en segundos. No necesitás hacer nada especial — ya lo hacés instintivamente cuando estás estresado. Hacerlo conscientemente amplifica el efecto.',
    highlights: [{ label: 'Técnica:', desc: '2 inhalaciones rápidas por nariz + 1 exhalación larga por boca.' }],
    closing: 'El suspiro fisiológico es la herramienta de regulación más rápida que existe.',
  },
  {
    title: 'CO2 vs O2: lo que realmente controla la respiración',
    content: 'Contrariamente a lo que parece intuitivo, la urgencia de respirar no la genera la falta de oxígeno sino el exceso de CO2. El CO2 es el regulador primario del impulso respiratorio. Personas que respiran demasiado rápido crónicamente tienen menor tolerancia al CO2 y mayor ansiedad basal. Entrenar retenciones suaves aumenta la tolerancia al CO2 y reduce la reactividad del sistema nervioso.',
    highlights: [{ label: 'Práctica:', desc: 'retenciones post-exhalación de 5-10 segundos en reposo.' }],
    closing: 'Mejorar la tolerancia al CO2 es mejorar la tolerancia al estrés.',
  },
  {
    title: 'Respirar por la nariz vs la boca',
    content: 'La nariz filtra, humidifica, calienta y presuriza el aire. Genera óxido nítrico (vasodilatador natural). La respiración nasal aumenta la eficiencia del intercambio gaseoso un 10-20% vs la bucal. La respiración bucal crónica, especialmente durante el sueño, se asocia con mayor cortisol, peor calidad de sueño y mayor frecuencia cardíaca.',
    highlights: [{ label: 'Objetivo:', desc: 'respiración nasal en reposo y a baja intensidad de ejercicio.' }],
    closing: 'La nariz es para respirar. La boca es para comer y hablar.',
  },
];

function Card({ card }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(38,70,83,0.06)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 p-5 text-left" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: card.bg }}>{card.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{card.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{card.content}</p>
          <div className="space-y-1.5">{card.bullets.map((b, i) => <p key={i} className="text-sm text-foreground">• {b}</p>)}</div>
          <div className="rounded-xl px-4 py-3" style={{ background: '#264653' }}>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: 'white' }}>{card.conclusion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Micro({ ml, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#264653' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 p-4 text-left" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E9C46A20' }}>
          <span className="text-sm font-bold" style={{ color: '#E9C46A' }}>{index + 1}</span>
        </div>
        <p className="flex-1 text-sm font-bold" style={{ color: 'white' }}>{ml.title}</p>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} /> : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />}
      </button>
      {open && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{ml.content}</p>
          {ml.highlights.map((h, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-sm font-bold flex-shrink-0" style={{ color: '#E9C46A' }}>{h.label}</span>
              {h.desc && <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{h.desc}</span>}
            </div>
          ))}
          <p className="text-sm font-bold" style={{ color: '#E9C46A' }}>{ml.closing}</p>
        </div>
      )}
    </div>
  );
}

export default function RespiracionSection() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #264653, #52b788)' }}>
        <p className="text-xs font-bold mb-2" style={{ color: '#E9C46A', letterSpacing: '2px', textTransform: 'uppercase' }}>🌬️ Respiración</p>
        <p className="text-lg font-bold mb-2" style={{ color: 'white' }}>El control remoto del SN</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          La respiración es el único sistema autónomo que podés controlar conscientemente. Dominarla es dominar tu estado.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['diafragma', 'nervio vago', 'box breathing', 'coherencia cardíaca', 'CO2'].map(t => (
            <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>{t}</span>
          ))}
        </div>
      </div>
      <p className="text-xs font-bold text-foreground uppercase tracking-widest">Técnicas y conceptos</p>
      {CARDS.map(c => <Card key={c.id} card={c} />)}
      <p className="text-xs font-bold text-foreground uppercase tracking-widest pt-2">Microaprendizajes</p>
      {MICROLEARNINGS.map((ml, i) => <Micro key={i} ml={ml} index={i} />)}
      <div style={{ height: '8px' }} />
    </div>
  );
}