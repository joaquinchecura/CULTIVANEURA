import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CARDS = [
  {
    id: 'sn_intro',
    emoji: '⚡',
    color: '#E07A5F',
    bg: '#E07A5F15',
    title: 'Sistema nervioso autónomo',
    description: 'El director invisible de tu cuerpo.',
    content: 'El sistema nervioso autónomo (SNA) regula funciones vitales sin intervención consciente. Tiene dos ramas principales que trabajan en oposición y equilibrio:',
    bullets: ['Sistema simpático → acción, alerta, estrés', 'Sistema parasimpático → descanso, digestión, recuperación'],
    conclusion: 'Tu estado físico y emocional en cada momento depende de cuál rama domina.',
  },
  {
    id: 'simpatico',
    emoji: '🔴',
    color: '#FF6B6B',
    bg: '#FF6B6B15',
    title: 'Sistema simpático',
    description: 'Modo acción. Modo supervivencia.',
    content: 'Se activa ante cualquier desafío percibido — real o imaginado. Genera una cascada hormonal inmediata:',
    bullets: ['↑ Frecuencia cardíaca y presión arterial', '↑ Cortisol y adrenalina', '↑ Glucosa en sangre', '↓ Digestión y sistema inmune'],
    conclusion: 'Útil para entrenar, reaccionar y rendir. Problemático cuando es crónico.',
  },
  {
    id: 'parasimpatico',
    emoji: '🟢',
    color: '#52b788',
    bg: '#52b78815',
    title: 'Sistema parasimpático',
    description: 'Modo recuperación. Modo crecimiento.',
    content: 'Activo en reposo, sueño y calma. Es cuando el cuerpo repara, aprende y crece:',
    bullets: ['↓ Frecuencia cardíaca', '↑ Digestión y absorción', '↑ Sistema inmune', '↑ Síntesis de proteínas y hormonas anabólicas'],
    conclusion: 'Sin tiempo parasimpático suficiente, no hay recuperación ni progreso real.',
  },
  {
    id: 'nervio_vago',
    emoji: '〰️',
    color: '#457B9D',
    bg: '#457B9D15',
    title: 'Nervio vago',
    description: 'El cable de red del sistema parasimpático.',
    content: 'Es el nervio más largo del cuerpo. Conecta el cerebro con el corazón, pulmones y abdomen. Su tono determina cuán bien podés regularte:',
    bullets: ['Alto tono vagal → fácil calmar, buena recuperación', 'Bajo tono vagal → difícil regular, más reactividad', 'Se entrena con: respiración lenta, frío, canto, meditación'],
    conclusion: 'El tono vagal es uno de los mejores predictores de salud cardiovascular y resiliencia emocional.',
  },
  {
    id: 'hrv',
    emoji: '📈',
    color: '#2A9D8F',
    bg: '#2A9D8F15',
    title: 'HRV — Variabilidad de la frecuencia cardíaca',
    description: 'El marcador de recuperación más preciso.',
    content: 'El HRV mide la variación en el tiempo entre latidos. No es constante — ni debería serlo. Alta variabilidad = sistema nervioso flexible y adaptable:',
    bullets: ['HRV alto → recuperado, listo para estímulo', 'HRV bajo → fatigado, necesita descanso', 'Factores que lo bajan: alcohol, mala noche, estrés, sobreentrenamiento'],
    conclusion: 'Monitorear el HRV te da una ventana objetiva a tu estado de recuperación real.',
  },
  {
    id: 'homeostasis',
    emoji: '⚖️',
    color: '#E9C46A',
    bg: '#E9C46A15',
    title: 'Homeostasis y alostasis',
    description: 'El cuerpo siempre busca equilibrio.',
    content: 'Homeostasis = mantener estabilidad interna. Alostasis = adaptarse activamente al cambio. El entrenamiento y el estrés rompen la homeostasis temporalmente para forzar adaptación:',
    bullets: ['Estímulo → ruptura temporal del equilibrio', 'Recuperación → supercompensación', 'Sin recuperación → acumulación de deuda alostática'],
    conclusion: 'Progresar = romper el equilibrio con intención y recuperarlo mejor de lo que estabas.',
  },
];

const MICROLEARNINGS = [
  {
    title: 'Tu SN no distingue peligro real de imaginado',
    content: 'Un pensamiento ansioso activa el mismo sistema simpático que una amenaza física. Por eso el estrés crónico mental tiene consecuencias físicas reales: tensión muscular, digestión alterada, inmunidad baja.',
    highlights: [{ label: 'Clave', desc: 'el cuerpo responde a lo que percibe, no a lo que es.' }],
    closing: 'Entrenar la mente es entrenar el sistema nervioso.',
  },
  {
    title: 'La recuperación no es opcional',
    content: 'El sistema nervioso no crece durante el estrés — crece durante la recuperación. Un atleta que no duerme, no descansa y no gestiona el estrés está acumulando déficit neurológico, no construyendo capacidad.',
    highlights: [
      { label: 'Sueño', desc: 'restaura el SNC completamente.' },
      { label: 'Descanso activo', desc: 'activa el parasimpático sin inmovilidad total.' },
    ],
    closing: 'La recuperación es parte del entrenamiento, no su ausencia.',
  },
  {
    title: 'Cómo leer tu propio SN',
    content: 'Señales de dominancia simpática: mandíbula tensa, hombros elevados, respiración corta, mente acelerada, digestión lenta. Señales de dominancia parasimpática: respiración profunda, músculos relajados, claridad mental, hambre estable.',
    highlights: [{ label: 'Práctica', desc: 'escaneá tu cuerpo 3 veces por día y anotá lo que observás.' }],
    closing: 'La interoceptión es el primer paso hacia la autorregulación.',
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

export default function SistemaNerviosoSection() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #264653, #E07A5F)' }}>
        <p className="text-xs font-bold mb-2" style={{ color: '#E9C46A', letterSpacing: '2px', textTransform: 'uppercase' }}>⚡ Sistema Nervioso</p>
        <p className="text-lg font-bold mb-2" style={{ color: 'white' }}>El sistema que lo regula todo</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Tu rendimiento, tu recuperación y tu estado emocional dependen directamente del equilibrio entre el sistema simpático y parasimpático.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['simpático', 'parasimpático', 'nervio vago', 'HRV', 'homeostasis'].map(t => (
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
