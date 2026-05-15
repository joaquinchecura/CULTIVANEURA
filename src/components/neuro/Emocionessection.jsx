import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CARDS = [
  {
    id: 'que_son',
    emoji: '❤️',
    color: '#E07A5F',
    bg: '#E07A5F15',
    title: '¿Qué son las emociones?',
    description: 'Información del cuerpo, no el enemigo.',
    content: 'Las emociones son respuestas fisiológicas y mentales que el cerebro genera para prepararte a actuar. No son debilidades — son datos:',
    bullets: ['Tienen una función adaptativa específica', 'Duran segundos o minutos si no se amplifican', 'El problema no es sentirlas — es no saber qué hacer con ellas'],
    conclusion: 'Resistir una emoción la amplifica. Observarla la regula.',
  },
  {
    id: 'cerebro_emocional',
    emoji: '🧠',
    color: '#6B5B95',
    bg: '#6B5B9515',
    title: 'El cerebro emocional',
    description: 'La amígdala manda antes de que pienses.',
    content: 'La amígdala procesa el peligro percibido en milisegundos — antes de que la corteza prefrontal (pensamiento racional) pueda intervenir. Este "secuestro amigdalar" explica por qué reaccionamos antes de pensar:',
    bullets: ['Amígdala → respuesta emocional automática', 'Corteza prefrontal → regulación y perspectiva', 'La brecha entre estímulo y respuesta se entrena'],
    conclusion: 'La inteligencia emocional no es suprimir la amígdala — es fortalecer la corteza prefrontal.',
  },
  {
    id: 'ventana_tolerancia',
    emoji: '🪟',
    color: '#2A9D8F',
    bg: '#2A9D8F15',
    title: 'Ventana de tolerancia',
    description: 'La zona donde podés funcionar bien.',
    content: 'Es el rango de activación en el que el sistema nervioso puede procesar información y responder adaptativamente. Fuera de ella, el funcionamiento se deteriora:',
    bullets: ['Hiperactivación → ansiedad, pánico, agresión', 'Hipoactivación → disociación, apatía, entumecimiento', 'Dentro → claridad, conexión, capacidad de acción'],
    conclusion: 'Ampliar tu ventana de tolerancia es el objetivo de toda práctica de regulación.',
  },
  {
    id: 'regulacion',
    emoji: '🎛️',
    color: '#457B9D',
    bg: '#457B9D15',
    title: 'Regulación emocional',
    description: 'Gestionar sin suprimir.',
    content: 'Regular no significa no sentir — significa elegir cómo responder. Las estrategias más efectivas:',
    bullets: ['Nombrar la emoción (reduce activación amigdalar)', 'Respiración lenta (activa nervio vago)', 'Movimiento físico (metaboliza cortisol y adrenalina)', 'Contacto social seguro (oxitocina regula el SN)'],
    conclusion: 'Nombrar una emoción con precisión reduce su intensidad. El vocabulario emocional es una herramienta real.',
  },
  {
    id: 'emociones_secundarias',
    emoji: '🔄',
    color: '#E9C46A',
    bg: '#E9C46A15',
    title: 'Emociones primarias vs secundarias',
    description: 'Lo que mostrás vs lo que sentís.',
    content: 'Las emociones primarias son las respuestas inmediatas y auténticas. Las secundarias son reacciones a las primarias — a menudo aprendidas culturalmente:',
    bullets: ['Primaria: miedo → Secundaria: enojo (más aceptable socialmente)', 'Primaria: tristeza → Secundaria: irritabilidad', 'Primaria: vergüenza → Secundaria: orgullo defensivo'],
    conclusion: 'Trabajar con la emoción primaria es más efectivo que gestionar la secundaria.',
  },
  {
    id: 'co_regulacion',
    emoji: '🤝',
    color: '#52b788',
    bg: '#52b78815',
    title: 'Co-regulación',
    description: 'Los humanos nos regulamos en relación.',
    content: 'El sistema nervioso humano está diseñado para regularse a través del contacto con otros. La co-regulación es un mecanismo neurobiológico real:',
    bullets: ['Un abrazo de 20+ segundos libera oxitocina', 'La voz calmada de otro activa el nervio vago', 'La presencia segura de otro reduce cortisol medible'],
    conclusion: 'Buscar apoyo no es debilidad. Es neurobiología básica.',
  },
];

const MICROLEARNINGS = [
  {
    title: 'El nombre de la emoción importa',
    content: 'Investigaciones en neurociencia afectiva muestran que nombrar una emoción con precisión ("estoy frustrado" vs "estoy mal") reduce la activación de la amígdala. Cuanto más específico el vocabulario emocional, más efectiva la regulación.',
    highlights: [{ label: 'Práctica:', desc: 'intentá nombrar lo que sentís con la mayor precisión posible.' }],
    closing: 'El lenguaje emocional preciso es una herramienta de regulación.',
  },
  {
    title: 'Las emociones duran 90 segundos',
    content: 'Según la neurobióloga Jill Bolte Taylor, la respuesta fisiológica de una emoción dura aproximadamente 90 segundos. Lo que dura más es el pensamiento que la alimenta. Si la emoción persiste, es porque la estamos recreando mentalmente.',
    highlights: [{ label: 'Implicancia:', desc: 'podés dejar pasar una ola emocional si no la amplificas.' }],
    closing: '90 segundos de observación sin reacción cambia el patrón.',
  },
  {
    title: 'Emoción + movimiento = regulación',
    content: 'Las emociones son energía que busca movimiento — literalmente. El cortisol y la adrenalina se metabolizan con actividad física. Por eso después de una discusión intensa una caminata cambia el estado más que diez minutos de análisis.',
    highlights: [{ label: 'Protocolo:', desc: '10 minutos de movimiento moderado post-activación emocional intensa.' }],
    closing: 'El cuerpo procesa lo que la mente no puede.',
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
            <div key={i} className="flex gap-2">
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

export default function EmocionesSection() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #264653, #6B5B95)' }}>
        <p className="text-xs font-bold mb-2" style={{ color: '#E9C46A', letterSpacing: '2px', textTransform: 'uppercase' }}>❤️ Emociones</p>
        <p className="text-lg font-bold mb-2" style={{ color: 'white' }}>Las emociones son información</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          No son el enemigo ni la meta. Son señales del sistema nervioso que te dicen algo sobre vos y tu entorno.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['amígdala', 'regulación', 'ventana de tolerancia', 'co-regulación', 'vocabulario emocional'].map(t => (
            <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>{t}</span>
          ))}
        </div>
      </div>
      <p className="text-xs font-bold text-foreground uppercase tracking-widest">Conceptos clave</p>
      {CARDS.map(c => <Card key={c.id} card={c} />)}
      <p className="text-xs font-bold text-foreground uppercase tracking-widest pt-2">Microaprendizajes</p>
      {MICROLEARNINGS.map((ml, i) => <Micro key={i} ml={ml} index={i} />)}
      <div style={{ height: '8px' }} />
    </div>
  );
}