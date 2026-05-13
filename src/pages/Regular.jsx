import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Clock, Wind, Zap, Moon, Dumbbell, Brain, Droplets, Sun, Heart } from 'lucide-react';

const INTERVENTIONS = [
  // REGULADO
  {
    id: '1', title: 'Respiración Coherente', target_state: 'regulado',
    icon: Wind, color: '#2A9D8F', tag: 'Respiración',
    duration_minutes: 5,
    description: 'Sincroniza tu ritmo cardíaco y sistema nervioso con una respiración de 5-5. Ideal para mantener la calma y el foco ejecutivo.',
    instructions: `1. Encontrá una posición cómoda, sentado o acostado.\n2. Inhalá lentamente por la nariz contando hasta 5.\n3. Exhalá lentamente por la nariz o boca contando hasta 5.\n4. Repetí este ciclo durante 5 minutos.\n5. Intentá no forzar la respiración — que sea fluida y natural.\n\n💡 Esta técnica sincroniza el HRV (variabilidad de la frecuencia cardíaca) y activa el sistema parasimpático.`,
  },
  {
    id: '2', title: 'Activación de foco', target_state: 'regulado',
    icon: Brain, color: '#6B5B95', tag: 'Cognición',
    duration_minutes: 10,
    description: 'Cuando estás regulado es el mejor momento para activar el foco profundo. Usá esta técnica antes de tareas que requieren concentración.',
    instructions: `1. Cerrá todas las notificaciones y distracciones.\n2. Elegí UNA sola tarea para los próximos 25 minutos.\n3. Hacé 3 respiraciones profundas y conscientes.\n4. Mirá un punto fijo por 30 segundos (activa la red de atención).\n5. Arrancá la tarea con esa energía.\n\n💡 El sistema nervioso regulado es óptimo para el aprendizaje, la creatividad y la toma de decisiones complejas.`,
  },
  {
    id: '3', title: 'Entrenamiento de fuerza', target_state: 'regulado',
    icon: Dumbbell, color: '#4CAF50', tag: 'Movimiento',
    duration_minutes: 45,
    description: 'Aprovechá el estado regulado para entrenar con carga. Tu sistema nervioso puede manejar el estrés del entrenamiento y supercompensarlo.',
    instructions: `1. Calientá 5-10 minutos con movilidad articular.\n2. Trabajá con 70-85% de tu máximo en ejercicios compuestos.\n3. Descansá 2-3 minutos entre series pesadas.\n4. Terminá con 5 minutos de vuelta a la calma y respiración.\n\n💡 Estado regulado = óptimo para estímulo de fuerza, hipertrofia y aprendizaje motor.`,
  },
  {
    id: '4', title: 'Nutrición anti-inflamatoria', target_state: 'regulado',
    icon: Droplets, color: '#FF9800', tag: 'Nutrición',
    duration_minutes: 20,
    description: 'Cuando tu SN está equilibrado, la absorción de nutrientes es óptima. Aprovechá para reforzar con alimentos neuroprotectores.',
    instructions: `Alimentos clave para hoy:\n\n🐟 Omega 3: salmón, sardinas, chía, nueces\n🫐 Antioxidantes: arándanos, espinaca, cúrcuma\n🥑 Grasas saludables: palta, aceite de oliva\n🍳 Proteína de calidad: huevos, legumbres, pollo\n💧 Hidratación: mínimo 2L de agua\n\n💡 El cerebro es 60% grasa — los ácidos grasos esenciales son combustible para el sistema nervioso.`,
  },
  // ACTIVADO
  {
    id: '5', title: 'Box Breathing', target_state: 'activado',
    icon: Wind, color: '#4D96FF', tag: 'Respiración',
    duration_minutes: 5,
    description: 'La respiración cuadrada activa el nervio vago y baja la activación del sistema simpático en minutos. Usada por Navy SEALs y atletas de élite.',
    instructions: `1. Exhalá todo el aire lentamente.\n2. Inhalá por la nariz contando 4 segundos.\n3. Sostené el aire contando 4 segundos.\n4. Exhalá por la boca contando 4 segundos.\n5. Sostené sin aire contando 4 segundos.\n6. Repetí 4-6 veces.\n\n💡 Si los 4 segundos se sienten difíciles, empezá con 3. El objetivo es igualar los 4 tiempos.`,
  },
  {
    id: '6', title: 'Movimiento de descarga', target_state: 'activado',
    icon: Zap, color: '#E07A5F', tag: 'Movimiento',
    duration_minutes: 15,
    description: 'Cuando el sistema simpático está activo, el cuerpo necesita moverse para liberar el cortisol y la adrenalina acumulados.',
    instructions: `Circuito de 15 minutos:\n\n• 2 min: Caminata rápida o trote suave\n• 1 min: Saltos o jumping jacks\n• 1 min: Sentadillas\n• 1 min: Flexiones\n• 1 min: Descanso activo (caminar)\n• Repetí 2 veces más\n• 3 min finales: Respiración profunda y estiramiento\n\n💡 El movimiento convierte la energía del estrés en algo productivo y restablece el equilibrio hormonal.`,
  },
  {
    id: '7', title: 'Técnica 5-4-3-2-1', target_state: 'activado',
    icon: Brain, color: '#9B59B6', tag: 'Anclaje',
    duration_minutes: 5,
    description: 'Ancla tu atención al presente usando los 5 sentidos. Interrumpe el ciclo de activación mental y trae al sistema nervioso al momento actual.',
    instructions: `Tomá 5 respiraciones profundas y luego:\n\n👁️ Nombra 5 cosas que podés VER ahora mismo\n✋ Tocá 4 cosas y nombra su TEXTURA\n👂 Escuchá y nombra 3 cosas que podés OÍR\n👃 Identificá 2 cosas que podés OLER\n👅 Identificá 1 cosa que podés SABOREAR\n\n💡 Esta técnica redirige el sistema nervioso desde el modo "amenaza" hacia el momento presente.`,
  },
  {
    id: '8', title: 'Cold exposure corto', target_state: 'activado',
    icon: Droplets, color: '#00BCD4', tag: 'Resilencia',
    duration_minutes: 5,
    description: 'La exposición al frío al final de la ducha regula el sistema nervioso, libera dopamina y mejora el estado de ánimo.',
    instructions: `1. Terminá tu ducha normal.\n2. Girá el agua al frío (lo más fría que puedas).\n3. Permanecer 30 segundos (luego aumentá gradualmente).\n4. Enfocáte en la respiración — no contengás el aliento.\n5. Salí de la ducha y notá el efecto en tu estado.\n\n💡 El frío activa el sistema parasimpático post-exposición, generando calma y alerta al mismo tiempo.`,
  },
  // COLAPSADO
  {
    id: '9', title: 'Activación suave matinal', target_state: 'colapsado',
    icon: Sun, color: '#F4C430', tag: 'Activación',
    duration_minutes: 10,
    description: 'Cuando el sistema nervioso está colapsado, necesita activación gradual. Empezá desde adentro hacia afuera.',
    instructions: `1. Tumbáte boca arriba con rodillas dobladas.\n2. Respirá profundo inflando la panza (no el pecho) — 5 veces.\n3. Estirá los brazos sobre la cabeza y bostezá con ganas.\n4. Masajeáte suavemente el cuello, hombros y cara.\n5. Sentáte lentamente y tomá un vaso de agua.\n6. Salí 5 minutos al aire libre o asomáte a una ventana con luz.\n\n💡 La luz solar matinal es el regulador del ritmo circadiano más poderoso — activa el cortisol positivo del despertar.`,
  },
  {
    id: '10', title: 'Nutrición para el colapso', target_state: 'colapsado',
    icon: Droplets, color: '#795548', tag: 'Nutrición',
    duration_minutes: 15,
    description: 'El colapso del sistema nervioso puede deberse a déficit energético. La nutrición correcta es la intervención más directa.',
    instructions: `Prioridades ahora:\n\n💧 HIDRATACIÓN primero: agua con una pizca de sal y limón\n🍌 Potasio: banana, batata, espinaca\n🥚 Proteína fácil: huevos revueltos, yogur, legumbres\n🫚 Glucosa estable: avena, arroz integral (NO azúcar procesada)\n☕ Cafeína CON MODERACIÓN si la usás habitualmente\n\n⚠️ Evitá: azúcar refinada, ultraprocesados, alcohol — profundizan el colapso.\n\n💡 El sistema nervioso consume ~20% de la glucosa corporal. El colapso suele tener una base metabólica.`,
  },
  {
    id: '11', title: 'Meditación de escaneo corporal', target_state: 'colapsado',
    icon: Moon, color: '#5B8FA8', tag: 'Mindfulness',
    duration_minutes: 15,
    description: 'El escaneo corporal activa la ínsula cerebral, mejora la conciencia interoceptiva y saca al SN del modo disociativo.',
    instructions: `1. Acostáte cómodamente con los ojos cerrados.\n2. Llevá la atención a los pies — simplemente observá las sensaciones.\n3. Subí lentamente: tobillos, pantorrillas, rodillas...\n4. Continuá por caderas, abdomen, pecho, manos, brazos.\n5. Terminá en cara, cabeza y cuero cabelludo.\n6. Hacé 3 respiraciones profundas y abrí los ojos despacio.\n\n💡 No hay que "hacer" nada — solo observar. El acto de prestar atención al cuerpo activa el sistema nervioso parasimpático.`,
  },
  {
    id: '12', title: 'Contacto social regulador', target_state: 'colapsado',
    icon: Heart, color: '#E91E63', tag: 'Social',
    duration_minutes: 20,
    description: 'El colapso del SN a menudo se resuelve con contacto social seguro. La co-regulación con otros es uno de los mecanismos más potentes.',
    instructions: `Opciones (de mayor a menor impacto):\n\n🫂 Abrazo físico prolongado (20+ segundos activa la oxitocina)\n📞 Llamada de voz con alguien de confianza\n💬 Mensaje de texto a alguien que te importa\n🐾 Contacto con una mascota\n🚶 Caminata en un lugar con otras personas (sin necesidad de interactuar)\n\n💡 Los humanos somos organismos de co-regulación. No estamos diseñados para regular el SN en soledad. Buscar contacto no es debilidad — es neurobiología.`,
  },
  // TODOS
  {
    id: '13', title: 'Respiración diafragmática', target_state: 'todos',
    icon: Wind, color: '#607D8B', tag: 'Respiración',
    duration_minutes: 5,
    description: 'La respiración diafragmática es la base de toda regulación del sistema nervioso. Funciona en cualquier estado.',
    instructions: `1. Poné una mano en el pecho y otra en la panza.\n2. Inhalá lentamente por la nariz — solo debe moverse la mano de la panza.\n3. El pecho no debe moverse (o muy poco).\n4. Exhalá despacio por la boca con labios fruncidos.\n5. La exhalación debe ser más larga que la inhalación.\n6. Practicá 5-10 minutos.\n\n💡 El 80% de las personas respiran con el pecho. Cambiar a respiración diafragmática activa el nervio vago en cada ciclo.`,
  },
  {
    id: '14', title: 'Exposición solar 10 min', target_state: 'todos',
    icon: Sun, color: '#FFC107', tag: 'Bienestar',
    duration_minutes: 10,
    description: 'La luz solar directa en los ojos (sin anteojos) en las primeras 2 horas del día es el regulador circadiano más poderoso disponible.',
    instructions: `1. Salí al exterior dentro de la primera hora tras despertarte.\n2. Mirá hacia el cielo (no al sol directamente) con los ojos abiertos.\n3. Permanecé 10 minutos — sin lentes de sol, sin vidrio de por medio.\n4. Si no hay sol, igual salí: la luz del cielo nublado es suficiente.\n5. Podés caminar, tomar un café o simplemente estar.\n\n💡 Este hábito sencillo regula el cortisol, la melatonina, el sueño, el estado de ánimo y la energía durante el día.`,
  },
  {
    id: '15', title: 'Caminata sin teléfono', target_state: 'todos',
    icon: Zap, color: '#8BC34A', tag: 'Movimiento',
    duration_minutes: 20,
    description: 'Caminar en modo "panorámico" (visión amplia, sin foco específico) activa el estado de calma-alerta y regula el cortisol.',
    instructions: `1. Dejá el teléfono en casa o en el bolsillo (sin usarlo).\n2. Caminá a ritmo moderado por un entorno agradable.\n3. Activá la visión panorámica: tratá de ver todo el campo visual periférico.\n4. No hay objetivo ni destino — solo caminar.\n5. Observá sonidos, colores, texturas sin juzgarlos.\n\n💡 La visión panorámica activa el sistema parasimpático. La visión enfocada (como al usar el teléfono) activa el sistema simpático.`,
  },
];

export default function Regular() {
  const [filter, setFilter] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(new Set());

  const filterOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'regulado', label: '🟢 Regulado' },
    { value: 'activado', label: '🟡 Activado' },
    { value: 'colapsado', label: '🔴 Colapsado' },
  ];

  const filtered = INTERVENTIONS.filter(i =>
    filter === 'todos' || i.target_state === 'todos' || i.target_state === filter
  );

  function handleComplete(id) {
    setCompleted(prev => new Set([...prev, id]));
    setSelected(null);
  }

  const stateColors = {
    regulado: 'bg-emerald-50 border-emerald-200',
    activado: 'bg-amber-50 border-amber-200',
    colapsado: 'bg-rose-50 border-rose-200',
    todos: 'bg-slate-50 border-slate-200',
  };

  return (
    <div className="px-6 pt-12 pb-8">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Regulación</p>
        <h1 className="text-2xl font-serif text-foreground mt-0.5">Regular ahora</h1>
        <p className="text-sm text-muted-foreground mt-1">Técnicas basadas en neurociencia según tu estado</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
        {filterOptions.map(opt => (
          <button key={opt.value} onClick={() => setFilter(opt.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item, i) => (
          <motion.button key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setSelected(item)}
            className={`w-full text-left rounded-2xl p-4 border transition-all hover:shadow-md ${
              completed.has(item.id) ? 'opacity-60' : ''
            } ${stateColors[item.target_state]}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/70">
                <item.icon size={20} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/70"
                    style={{ color: item.color }}>{item.tag}</span>
                  {completed.has(item.id) && <span className="text-[10px] text-emerald-600 font-bold">✓ Hecho</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={11} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.duration_minutes} min</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground truncate">{item.description.slice(0, 50)}...</span>
                </div>
              </div>
              <span className="text-muted-foreground text-sm flex-shrink-0">→</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
            onClick={() => setSelected(null)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card rounded-t-3xl w-full max-w-lg p-6 pb-10 max-h-[88vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 pr-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${selected.color}20` }}>
                    <selected.icon size={22} style={{ color: selected.color }} />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-foreground">{selected.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{selected.duration_minutes} minutos</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${selected.color}20`, color: selected.color }}>{selected.tag}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{selected.description}</p>

              <div className="bg-muted rounded-2xl p-4 mb-5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Instrucciones</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{selected.instructions}</p>
              </div>

              <Button className="w-full rounded-xl text-white font-bold" style={{ background: selected.color }}
                onClick={() => handleComplete(selected.id)}>
                ✓ Completar técnica
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
