import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CARDS = [
  {
    id: 'zona_optima',
    emoji: '🎯',
    color: '#2A9D8F',
    bg: '#2A9D8F15',
    title: 'Zona de rendimiento óptimo',
    description: 'Ni poco ni demasiado estrés.',
    content: 'La ley de Yerkes-Dodson describe la relación entre activación y rendimiento. Existe una zona óptima — fuera de ella, el rendimiento cae:',
    bullets: ['Activación baja → aburrimiento, falta de foco, desempeño mediocre', 'Activación óptima → concentración, fluidez, máximo rendimiento', 'Activación alta → ansiedad, errores, bloqueo'],
    conclusion: 'Rendir mejor no es esforzarse más. Es calibrar el nivel de activación al desafío.',
  },
  {
    id: 'flow',
    emoji: '🌊',
    color: '#6B5B95',
    bg: '#6B5B9515',
    title: 'Estado de flow',
    description: 'Cuando el tiempo desaparece.',
    content: 'El flow (Csikszentmihalyi) es un estado de absorción total en una tarea donde el desafío iguala exactamente la habilidad. Condiciones para accederlo:',
    bullets: ['Desafío calibrado: ni demasiado fácil ni imposible', 'Objetivo claro y feedback inmediato', 'Eliminación de distracciones externas e internas', 'Autonomía y sentido de propósito en la tarea'],
    conclusion: 'El flow no se fuerza. Se diseña el contexto para que ocurra.',
  },
  {
    id: 'atencion',
    emoji: '🔦',
    color: '#E9C46A',
    bg: '#E9C46A15',
    title: 'Atención y foco',
    description: 'Tu recurso más escaso.',
    content: 'La atención sostenida es una capacidad limitada que se agota. El cerebro no hace multitasking — alterna entre tareas con un costo cognitivo en cada cambio:',
    bullets: ['Cambio de tarea → 15-20 min para recuperar foco profundo', 'Notificaciones → interrumpen incluso sin revisarlas', 'El foco profundo se entrena como un músculo', 'Límite natural: ~90 min de foco intenso antes de necesitar pausa'],
    conclusion: 'Proteger la atención es más importante que gestionar el tiempo.',
  },
  {
    id: 'estres_rendimiento',
    emoji: '⚡',
    color: '#E07A5F',
    bg: '#E07A5F15',
    title: 'Estrés como herramienta',
    description: 'El estrés agudo mejora el rendimiento.',
    content: 'El estrés agudo y manejable activa el sistema simpático de forma que mejora el rendimiento a corto plazo:',
    bullets: ['↑ Adrenalina → mayor velocidad de procesamiento', '↑ Cortisol → mayor disponibilidad de glucosa', '↑ Norepinefrina → mayor atención y foco', 'Esto es lo que llamamos "presión positiva"'],
    conclusion: 'La diferencia entre estrés dañino y útil es la duración y la percepción de control.',
  },
  {
    id: 'recuperacion_rendimiento',
    emoji: '🔋',
    color: '#52b788',
    bg: '#52b78815',
    title: 'Recuperación entre sesiones',
    description: 'El rendimiento se construye en el descanso.',
    content: 'El rendimiento cognitivo y físico sigue el mismo principio: el estímulo rompe el equilibrio, la recuperación genera la adaptación:',
    bullets: ['Micro-pausas (5 min/hora) → mantienen el foco sostenido', 'Pausa de almuerzo real → recupera el SNC para la tarde', 'Sueño → consolida aprendizajes del día anterior', 'Sin recuperación → rendimiento en descenso lineal'],
    conclusion: 'Planificar el descanso es tan importante como planificar el trabajo.',
  },
  {
    id: 'mentalidad',
    emoji: '🧠',
    color: '#457B9D',
    bg: '#457B9D15',
    title: 'Mentalidad de crecimiento',
    description: 'La creencia que cambia el resultado.',
    content: 'Carol Dweck identificó dos tipos de mentalidad con efectos medibles en el rendimiento:',
    bullets: ['Mentalidad fija → las capacidades son innatas y no cambian', 'Mentalidad de crecimiento → las capacidades se desarrollan con esfuerzo', 'La mentalidad de crecimiento predice mejor resiliencia ante el fracaso', 'Se puede cambiar conscientemente con práctica y lenguaje'],
    conclusion: '"Todavía no puedo" es más preciso y más útil que "no puedo".',
  },
];

const MICROLEARNINGS = [
  {
    title: 'El ritual pre-performance',
    content: 'Los atletas de élite usan rituales pre-competencia no por superstición sino por neurociencia: crean un estado fisiológico y mental consistente que activa las redes neuronales del rendimiento. El ritual es un disparador condicionado. Podés crear el tuyo: 3 respiraciones profundas + visualización + palabra de activación.',
    highlights: [{ label: 'Estructura:', desc: 'fisiología → visualización → intención.' }],
    closing: 'Un ritual de 2 minutos puede cambiar tu estado de rendimiento.',
  },
  {
    title: 'La noche anterior importa más que la mañana',
    content: 'El rendimiento del día siguiente se determina principalmente la noche anterior: calidad del sueño, qué comiste, nivel de estrés previo. La rutina matinal optimiza el estado ya establecido, pero no compensa una mala noche. Preparar el rendimiento empieza 12 horas antes.',
    highlights: [{ label: 'Protocolo:', desc: 'cierre del día laboral + sin pantallas 1h antes + temperatura fresca al dormir.' }],
    closing: 'Ganar la noche es ganar el día siguiente.',
  },
  {
    title: 'Visualización y rendimiento',
    content: 'La visualización mental activa los mismos circuitos neuronales que la ejecución real — con menor intensidad. Los estudios muestran que combinar práctica física con visualización supera a la práctica física sola. 10 minutos de visualización de alta calidad (detallada, sensorial, en primera persona) equivale a práctica física parcial.',
    highlights: [{ label: 'Clave:', desc: 'visualizar el proceso, no solo el resultado.' }],
    closing: 'El cerebro ensaya lo que luego ejecuta.',
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

export default function RendimientoSection() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #264653, #2A9D8F)' }}>
        <p className="text-xs font-bold mb-2" style={{ color: '#E9C46A', letterSpacing: '2px', textTransform: 'uppercase' }}>🎯 Rendimiento</p>
        <p className="text-lg font-bold mb-2" style={{ color: 'white' }}>Rendir sin quemarse</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          El rendimiento sostenible combina activación óptima, foco profundo y recuperación estratégica. No es esfuerzo máximo — es calibración inteligente.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['flow', 'zona óptima', 'atención', 'visualización', 'mentalidad'].map(t => (
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