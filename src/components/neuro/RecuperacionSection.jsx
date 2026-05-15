import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CARDS = [
  {
    id: 'sueno_base',
    emoji: '😴',
    color: '#457B9D',
    bg: '#457B9D15',
    title: 'El sueño es infraestructura',
    description: 'No es descanso. Es mantenimiento crítico.',
    content: 'Durante el sueño el cerebro y el cuerpo ejecutan procesos que son imposibles en vigilia:',
    bullets: ['Sistema glinfático → limpia residuos metabólicos del cerebro', 'Consolidación de memoria y aprendizaje motor', 'Síntesis de hormona de crecimiento (pico en sueño profundo)', 'Reparación tisular y regulación inmune'],
    conclusion: 'Dormir poco no es optimizar el tiempo. Es degradar todo lo demás.',
  },
  {
    id: 'fases',
    emoji: '🌊',
    color: '#6B5B95',
    bg: '#6B5B9515',
    title: 'Fases del sueño',
    description: 'Cada fase tiene una función específica.',
    content: 'El sueño se organiza en ciclos de ~90 minutos. Cada ciclo incluye:',
    bullets: ['N1-N2 (sueño ligero) → transición y consolidación de memoria', 'N3 (sueño profundo) → recuperación física, HGH, sistema inmune', 'REM → procesamiento emocional, creatividad, memoria declarativa'],
    conclusion: 'Cortar el sueño antes de completar los ciclos sacrifica desproporcionadamente el REM (que domina la segunda mitad de la noche).',
  },
  {
    id: 'higiene',
    emoji: '🌙',
    color: '#2A9D8F',
    bg: '#2A9D8F15',
    title: 'Higiene del sueño',
    description: 'Las variables que controlás.',
    content: 'Los factores más evidenciados para mejorar la calidad del sueño:',
    bullets: ['Temperatura: 18-20°C es óptimo para el descenso térmico', 'Luz: exposición solar matinal + oscuridad nocturna', 'Horario: consistencia circadiana > horas totales', 'Cafeína: vida media de 5-7h → última dosis antes de las 14h'],
    conclusion: 'La consistencia de horario es el factor más impactante. El ritmo circadiano es fisiológico, no cultural.',
  },
  {
    id: 'recuperacion_activa',
    emoji: '🚶',
    color: '#52b788',
    bg: '#52b78815',
    title: 'Recuperación activa',
    description: 'Moverse para recuperar, no para cansar.',
    content: 'La recuperación activa mantiene el flujo sanguíneo y reduce la rigidez sin generar nuevo daño muscular:',
    bullets: ['Caminata suave 20-30 min (activa parasimpático)', 'Movilidad articular y estiramientos dinámicos', 'Natación o ciclismo a baja intensidad', 'Yoga restaurativo o tai chi'],
    conclusion: 'El reposo total no es la mejor opción post-esfuerzo. El movimiento suave acelera la recuperación.',
  },
  {
    id: 'sobreentrenamiento',
    emoji: '⚠️',
    color: '#E07A5F',
    bg: '#E07A5F15',
    title: 'Síndrome de sobreentrenamiento',
    description: 'Más no siempre es mejor.',
    content: 'Cuando el estímulo supera consistentemente la capacidad de recuperación, el sistema colapsa:',
    bullets: ['Rendimiento estancado o en descenso', 'Fatiga persistente que no mejora con descanso', 'HRV bajo sostenido, frecuencia cardíaca en reposo elevada', 'Irritabilidad, disrupciones del sueño, pérdida de motivación'],
    conclusion: 'El sobreentrenamiento es una señal de infrarecuperación, no de falta de esfuerzo.',
  },
  {
    id: 'nutricion_recuperacion',
    emoji: '🥗',
    color: '#E9C46A',
    bg: '#E9C46A15',
    title: 'Nutrición para la recuperación',
    description: 'La ventana post-esfuerzo importa.',
    content: 'Los primeros 30-60 minutos post-entrenamiento son críticos para iniciar la recuperación muscular:',
    bullets: ['Proteína (0.3-0.4g/kg) → síntesis proteica muscular', 'Carbohidratos → reposición de glucógeno', 'Hidratación → 500ml por cada 0.5kg de peso perdido', 'Omega-3 → reduce inflamación post-esfuerzo'],
    conclusion: 'Entrenar sin nutrición adecuada post-esfuerzo es construir sin materiales.',
  },
];

const MICROLEARNINGS = [
  {
    title: 'La deuda de sueño es real y acumulativa',
    content: 'Dormir 6 horas por 10 días tiene el mismo impacto cognitivo que no dormir 24 horas seguidas. Y a diferencia de lo que se cree, no se "recupera" durmiendo más el fin de semana. El daño cognitivo de la privación crónica de sueño requiere semanas de sueño adecuado para revertirse.',
    highlights: [{ label: 'Umbral mínimo:', desc: '7 horas para la mayoría de adultos. Menos de 6 es privación crónica.' }],
    closing: 'No existe el "duermo poco pero funciono bien". Existe la adaptación a funcionar mal.',
  },
  {
    title: 'El frío como herramienta de recuperación',
    content: 'La inmersión en agua fría post-entrenamiento reduce el daño muscular inflamatorio y acelera la percepción de recuperación. Sin embargo, usarla inmediatamente después de entrenamientos de fuerza puede interferir con las adaptaciones hipertróficas. Mejor usarla en días de recuperación o post-cardio.',
    highlights: [
      { label: 'Post-fuerza:', desc: 'esperar 4-6 horas para no bloquear la síntesis proteica.' },
      { label: 'Post-cardio/competencia:', desc: 'inmediatamente es beneficioso.' },
    ],
    closing: 'El frío es una herramienta. Como toda herramienta, depende del cuándo.',
  },
  {
    title: 'Estrés mental = carga de recuperación',
    content: 'El sistema nervioso no distingue entre estrés físico y psicológico para efectos de recuperación. Un día de trabajo de alta demanda cognitiva y emocional suma a la carga total de recuperación. Por eso atletas en épocas de alto estrés laboral necesitan reducir el volumen de entrenamiento, no mantenerlo.',
    highlights: [{ label: 'Aplicación:', desc: 'en semanas de alto estrés, reducí el volumen un 20-30%.' }],
    closing: 'La recuperación es sistémica, no solo muscular.',
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

export default function RecuperacionSection() {
  return (
    <div className="px-4 py-4 space-y-3">
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #264653, #457B9D)' }}>
        <p className="text-xs font-bold mb-2" style={{ color: '#E9C46A', letterSpacing: '2px', textTransform: 'uppercase' }}>😴 Recuperación</p>
        <p className="text-lg font-bold mb-2" style={{ color: 'white' }}>Donde ocurre el progreso real</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
          El estímulo rompe el equilibrio. La recuperación construye la adaptación. Sin ella, el estrés solo acumula.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['sueño', 'HRV', 'recuperación activa', 'nutrición', 'sobreentrenamiento'].map(t => (
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