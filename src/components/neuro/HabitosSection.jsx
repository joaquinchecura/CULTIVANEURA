import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CARDS = [
  {
    id: 'que_es',
    emoji: '🔄',
    color: '#E9C46A',
    bg: '#E9C46A15',
    title: '¿Qué es un hábito?',
    description: 'Automatismo neuronal, no disciplina.',
    content: 'Un hábito es un comportamiento que el cerebro ha automatizado para ahorrar energía cognitiva. No requiere decisión consciente — se dispara solo ante el estímulo correcto:',
    bullets: ['Disparador → rutina → recompensa (loop de hábito)', 'Se forma por repetición en contexto consistente', 'Una vez instalado, es casi imposible de borrar — solo se puede reemplazar'],
    conclusion: 'Los hábitos no se rompen. Se reemplazan con rutinas alternativas ante el mismo disparador.',
  },
  {
    id: 'dopamina_habitos',
    emoji: '⚡',
    color: '#E9A820',
    bg: '#E9A82015',
    title: 'Dopamina y hábitos',
    description: 'El sistema de recompensa que te mueve.',
    content: 'La dopamina no se libera durante la recompensa — se libera en la anticipación. Esto explica por qué los hábitos son tan persistentes:',
    bullets: ['El cerebro aprende qué acciones predicen recompensa', 'Con el tiempo, el disparador solo ya activa dopamina', 'Hábitos negativos explotan este sistema → loop adictivo'],
    conclusion: 'Para instalar un hábito positivo, necesitás hacer que la anticipación sea placentera antes de que llegue la recompensa.',
  },
  {
    id: 'neuroplasticidad_habitos',
    emoji: '🧠',
    color: '#6B5B95',
    bg: '#6B5B9515',
    title: 'Neuroplasticidad y hábitos',
    description: 'Cada repetición cambia el cerebro.',
    content: 'Cada vez que ejecutás un comportamiento, la conexión neuronal asociada se refuerza. Con suficiente repetición, el pathway se mieliniza — se vuelve más rápido y eficiente:',
    bullets: ['Neuronas que disparan juntas, se conectan juntas', 'La mielinización hace la señal hasta 100x más rápida', 'Esto es por qué los hábitos se sienten "automáticos"'],
    conclusion: 'No estás "siendo disciplinado" cuando actúas desde un hábito. Estás usando hardware neuronal que construiste.',
  },
  {
    id: 'implementacion',
    emoji: '🎯',
    color: '#2A9D8F',
    bg: '#2A9D8F15',
    title: 'Intención de implementación',
    description: 'La técnica más efectiva para instalar hábitos.',
    content: 'Definir con precisión cuándo, dónde y cómo ejecutarás un comportamiento aumenta drásticamente la probabilidad de hacerlo. El formato es: "Cuando [situación], voy a [comportamiento]":',
    bullets: ['"Cuando me levante, tomaré un vaso de agua"', '"Después de cenar, saldré 15 min a caminar"', '"Antes de dormir, leeré 10 páginas"'],
    conclusion: 'La vaguedad mata los hábitos. La especificidad los instala.',
  },
  {
    id: 'stacking',
    emoji: '📚',
    color: '#457B9D',
    bg: '#457B9D15',
    title: 'Habit stacking',
    description: 'Apilar hábitos sobre hábitos existentes.',
    content: 'Anclar un nuevo comportamiento a uno ya automatizado reduce la fricción cognitiva al mínimo. El cerebro usa el hábito existente como disparador del nuevo:',
    bullets: ['"Después de hacer café, meditaré 5 minutos"', '"Cuando llegue al gym, haré 5 min de movilidad primero"', '"Antes de revisar el teléfono, escribiré 3 gratitudes"'],
    conclusion: 'Los hábitos más fáciles de instalar son los que se apoyan en otros ya sólidos.',
  },
  {
    id: 'friccion',
    emoji: '🔧',
    color: '#52b788',
    bg: '#52b78815',
    title: 'Fricción y diseño de entorno',
    description: 'Tu entorno diseña tu comportamiento.',
    content: 'El cerebro sigue el camino de menor resistencia. Reducir la fricción de los hábitos que querés, aumentar la fricción de los que no querés:',
    bullets: ['Querés leer → dejá el libro en la almohada', 'Querés comer sano → preparar la comida del día anterior', 'Querés usar menos el teléfono → cargarlo fuera del cuarto'],
    conclusion: 'El diseño del entorno es más poderoso que la fuerza de voluntad.',
  },
];

const MICROLEARNINGS = [
  {
    title: 'La regla de los 2 minutos',
    content: 'Si un nuevo hábito tarda menos de 2 minutos, hacelo ahora. Además, cualquier hábito puede escalarse con esta regla: el primer objetivo es solo aparecer. "Ir al gym" → calzarse las zapatillas. "Meditar 20 min" → sentarse 2 minutos. La identidad de alguien que ejecuta el hábito se construye con cada repetición, no con la duración.',
    highlights: [{ label: 'Principio:', desc: 'estandarizá antes de optimizar.' }],
    closing: 'Primero hacé que sea fácil existir. Después hacé que sea bueno.',
  },
  {
    title: 'El voto de identidad',
    content: 'Cada acción es un voto para el tipo de persona que querés ser. No es "estoy tratando de hacer ejercicio" — es "soy alguien que cuida su cuerpo". Los hábitos basados en identidad son más resistentes al abandono porque abandonarlos implica traicionar una imagen de uno mismo.',
    highlights: [{ label: 'Pregunta:', desc: '¿qué tipo de persona vota esta acción?' }],
    closing: 'El cambio de hábitos más duradero empieza con un cambio de identidad.',
  },
  {
    title: 'Recuperación ≠ fracaso',
    content: 'Saltear un hábito una vez no importa. Saltarlo dos veces seguidas inicia un nuevo hábito: el de no hacerlo. La regla del nunca dos veces es más importante que la consistencia perfecta. La consistencia imperfecta gana a la perfección intermitente.',
    highlights: [{ label: 'Meta:', desc: 'no saltarlo dos veces seguidas.' }],
    closing: 'Los hábitos son una práctica, no una prueba.',
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

export default function HabitosSection() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #264653, #E9A820)' }}>
        <p className="text-xs font-bold mb-2" style={{ color: '#E9C46A', letterSpacing: '2px', textTransform: 'uppercase' }}>🔄 Hábitos</p>
        <p className="text-lg font-bold mb-2" style={{ color: 'white' }}>El comportamiento automatizado</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Los hábitos no dependen de la motivación. Dependen del diseño. Entendé cómo funciona el cerebro para construir los que querés.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['dopamina', 'loop de hábito', 'neuroplasticidad', 'fricción', 'identidad'].map(t => (
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