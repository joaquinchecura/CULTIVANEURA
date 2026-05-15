import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EducationCard from './EducationCard';

const CATEGORIES = [
  {
    id: 'inteligencia_sensorial', title: 'Inteligencia Sensorial', emoji: '🧠',
    cards: [
      { id: 'interocepcion', title: 'Interocepción', content: 'Capacidad de sentir lo que sucede dentro del cuerpo.', examples: ['Latidos del corazón', 'Respiración', 'Hambre o saciedad', 'Tensión muscular', 'Temperatura corporal'], tip: 'Detectar estas señales ayuda a reconocer estrés o fatiga.', color: '#52b788' },
      { id: 'propiocepcion', title: 'Propiocepción', content: 'Conciencia de la posición y movimiento del cuerpo.', examples: ['Equilibrio', 'Coordinación', 'Postura', 'Control articular'], tip: 'Una buena propiocepción mejora el movimiento y previene lesiones.', color: '#2A9D8F' },
      { id: 'exterocepcion', title: 'Exterocepción', content: 'Información que recibimos del entorno a través de los sentidos.', examples: ['Vista', 'Audición', 'Tacto', 'Olfato', 'Temperatura externa'], tip: 'El entorno influye en nuestro estado emocional.', color: '#E9C46A' },
      { id: 'inteligencia_emocional', title: 'Inteligencia emocional', content: 'Capacidad de reconocer y regular las emociones.', examples: ['Reconocer emociones', 'Comprender su origen', 'Regular respuestas emocionales'], tip: 'La regulación emocional impacta directamente en la salud física y mental.', color: '#6B5B95' },
    ]
  },
  {
    id: 'sistema_nervioso', title: 'Sistema Nervioso', emoji: '⚡',
    cards: [
      { id: 'simpatico', title: 'Sistema nervioso simpático', content: 'Estado de alerta y activación del organismo.', functions: ['Aumenta frecuencia cardíaca', 'Eleva cortisol y adrenalina', 'Moviliza energía', 'Prepara al cuerpo para la acción'], tip: 'Se activa durante el entrenamiento o situaciones de estrés.', color: '#E07A5F' },
      { id: 'parasimpatico', title: 'Sistema nervioso parasimpático', content: 'Estado de recuperación y descanso.', functions: ['Favorece la digestión', 'Promueve el descanso', 'Regeneración celular', 'Recuperación del sistema nervioso'], tip: 'Respiración lenta y relajación ayudan a activarlo.', color: '#52b788' },
      { id: 'nervio_vago', title: 'Nervio vago', content: 'Principal vía del sistema parasimpático.', functions: ['Regula ritmo cardíaco', 'Controla digestión', 'Participa en regulación emocional'], tip: 'Respirar lento y profundo estimula el nervio vago.', color: '#457B9D' },
      { id: 'homeostasis', title: 'Homeostasis', content: 'Equilibrio interno del organismo.', examples: ['Regulación de temperatura', 'Control de presión arterial', 'Balance energético', 'Equilibrio de líquidos'], tip: 'El cuerpo siempre busca mantener estabilidad interna.', color: '#2A9D8F' },
      { id: 'alostasis', title: 'Alostasis', content: 'Capacidad del cuerpo de adaptarse a cambios y estrés.', examples: ['Adaptación al entrenamiento', 'Cambios ambientales', 'Desafíos emocionales'], tip: 'El progreso físico depende de la capacidad de adaptación.', color: '#E9C46A' },
    ]
  },
  {
    id: 'estres', title: 'Estrés', emoji: '😥',
    cards: [
      { id: 'estres_agudo', title: 'Estrés agudo', content: 'Respuesta breve del organismo ante un desafío.', examples: ['Entrenamiento intenso', 'Competencia', 'Situaciones exigentes'], tip: 'Puede mejorar el rendimiento cuando es temporal.', color: '#E07A5F' },
      { id: 'estres_cronico', title: 'Estrés crónico', content: 'Estrés prolongado sin suficiente recuperación.', effects: ['Fatiga', 'Problemas de sueño', 'Inflamación', 'Baja energía'], tip: 'El descanso y la regulación emocional son claves para evitarlo.', color: '#457B9D' },
      { id: 'cortisol', title: 'Cortisol', content: 'Hormona principal relacionada con el estrés.', functions: ['Movilizar energía', 'Aumentar glucosa en sangre', 'Preparar al cuerpo para la acción'], tip: 'Niveles altos prolongados pueden afectar recuperación.', color: '#E9C46A' },
      { id: 'adaptacion', title: 'Adaptación', content: 'Capacidad del cuerpo para fortalecerse ante estímulos.', examples: ['Entrenamiento', 'Exposición al frío', 'Prácticas respiratorias'], tip: 'La adaptación requiere estímulo y recuperación.', color: '#2A9D8F' },
      { id: 'regulacion_emocional', title: 'Regulación emocional', content: 'Capacidad de gestionar estados emocionales intensos.', tools: ['Respiración', 'Movimiento', 'Descanso', 'Conciencia corporal'], color: '#6B5B95' },
    ]
  },
  {
    id: 'respiracion', title: 'Respiración', emoji: '🌬️',
    cards: [
      { id: 'respiracion_lenta', title: 'Respiración lenta', content: 'Respirar despacio reduce el estrés.', benefits: ['Activa sistema parasimpático', 'Reduce frecuencia cardíaca', 'Mejora concentración'], color: '#52b788' },
      { id: 'respiracion_diafragmatica', title: 'Respiración diafragmática', content: 'Respiración profunda utilizando el diafragma.', benefits: ['Mayor oxigenación', 'Relajación corporal', 'Mejor control respiratorio'], color: '#2A9D8F' },
      { id: 'exhalacion_larga', title: 'Exhalación larga', content: 'Exhalar más tiempo que inhalar favorece la relajación.', example: 'Inhalar 4 segundos, exhalar 6 segundos.', color: '#457B9D' },
      { id: 'hiperventilacion', title: 'Hiperventilación', content: 'Respiración rápida o superficial.', effects: ['Ansiedad', 'Mareos', 'Tensión'], tip: 'La respiración consciente ayuda a regularla.', color: '#E07A5F' },
    ]
  },
  {
    id: 'sueno_recuperacion', title: 'Sueño y Recuperación', emoji: '😴',
    cards: [
      { id: 'fases_sueno', title: 'Fases del sueño', content: 'El sueño se organiza en ciclos.', phases: ['Sueño ligero', 'Sueño profundo', 'Sueño REM'], color: '#457B9D' },
      { id: 'sueno_rem', title: 'Sueño REM', content: 'Fase asociada a sueños y procesamiento emocional.', benefits: ['Memoria', 'Aprendizaje', 'Salud mental'], color: '#6B5B95' },
      { id: 'recuperacion_cerebral', title: 'Recuperación cerebral', content: 'Durante el sueño el cerebro limpia residuos metabólicos y consolida la memoria.', color: '#E9C46A' },
      { id: 'sueno_hormonas', title: 'Sueño y hormonas', content: 'El sueño regula hormonas importantes.', hormones: ['Cortisol', 'Melatonina', 'Hormona de crecimiento'], color: '#2A9D8F' },
    ]
  },
  {
    id: 'habitos', title: 'Hábitos', emoji: '🔄',
    cards: [
      { id: 'dopamina', title: 'Dopamina', content: 'Neurotransmisor relacionado con motivación y recompensa.', color: '#E9C46A' },
      { id: 'recompensa', title: 'Recompensa', content: 'El cerebro refuerza comportamientos que generan satisfacción.', color: '#2A9D8F' },
      { id: 'disparador', title: 'Disparador', content: 'Elemento que inicia un hábito.', examples: ['Horario', 'Lugar', 'Emoción'], color: '#E07A5F' },
      { id: 'habito', title: 'Hábito', content: 'Comportamiento repetido que se vuelve automático.', color: '#52b788' },
      { id: 'neuroplasticidad', title: 'Neuroplasticidad', content: 'Capacidad del cerebro de cambiar y adaptarse.', examples: ['Aprender habilidades', 'Cambiar hábitos', 'Mejorar patrones de pensamiento'], color: '#457B9D' },
    ]
  },
  {
    id: 'emociones', title: 'Emociones', emoji: '❤️',
    cards: [
      { id: 'miedo', title: 'Miedo', content: 'Emoción asociada a protección y supervivencia. Genera alerta, tensión muscular y aumento de frecuencia cardíaca.', color: '#E07A5F' },
      { id: 'alegria', title: 'Alegría', content: 'Emoción asociada a bienestar. Genera relajación, energía y motivación.', color: '#E9C46A' },
      { id: 'tristeza', title: 'Tristeza', content: 'Emoción asociada a introspección y procesamiento emocional. Puede favorecer la adaptación.', color: '#6B5B95' },
      { id: 'enojo', title: 'Enojo', content: 'Respuesta ante frustración o injusticia. Bien regulado puede convertirse en acción constructiva.', color: '#457B9D' },
      { id: 'gratitud', title: 'Gratitud', content: 'Emoción que fortalece bienestar psicológico, vínculos sociales y salud mental.', color: '#52b788' },
      { id: 'amor', title: 'Amor', content: 'Estado emocional asociado a conexión, seguridad y cooperación.', color: '#2A9D8F' },
      { id: 'optimismo', title: 'Optimismo', content: 'Actitud mental orientada a esperanza y posibilidad. Mejora resiliencia y motivación.', color: '#E9C46A' },
    ]
  },
];

export default function NeurocienciaContent({ onBack }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const category = CATEGORIES.find(c => c.id === activeCategory);

  if (category) {
    return (
      <div>
        <button onClick={() => setActiveCategory(null)} className="flex items-center gap-2 px-4 py-3 bg-white w-full text-left"
          style={{ border: 'none', borderBottom: '1px solid #E9ECEF', cursor: 'pointer' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#264653' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#264653' }}>{category.title}</span>
        </button>
        <div className="px-4 py-4 space-y-3">
          {category.cards.map(card => <EducationCard key={card.id} card={card} />)}
        </div>
        <div style={{ height: '24px' }} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 px-4 py-3 bg-white w-full text-left"
        style={{ border: 'none', borderBottom: '1px solid #E9ECEF', cursor: 'pointer' }}>
        <ChevronLeft className="w-4 h-4" style={{ color: '#264653' }} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#264653' }}>Neurociencia</span>
      </button>

      <div className="px-4 py-4 space-y-3">
        <div className="rounded-2xl p-5" style={{ background: '#264653' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#E9C46A', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
            🧠 Neurociencia
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
            Comprendé cómo el cerebro, el sistema nervioso y las emociones influyen en tu cuerpo y bienestar.
          </p>
          <p style={{ fontSize: '13px', color: '#2A9D8F', fontWeight: 600, marginTop: '10px' }}>
            Regulación emocional · Descanso · Energía · Hábitos
          </p>
        </div>

        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className="w-full text-left bg-white rounded-2xl border border-[#E9ECEF] px-4 py-4 flex items-center gap-3"
            style={{ boxShadow: '0 2px 8px rgba(38,70,83,0.05)', cursor: 'pointer' }}>
            <span style={{ fontSize: '26px', width: '36px', flexShrink: 0 }}>{cat.emoji}</span>
            <div className="flex-1">
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#264653' }}>{cat.title}</p>
              <p style={{ fontSize: '12px', color: '#6C757D', marginTop: '2px' }}>{cat.cards.length} conceptos</p>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#ADB5BD' }} />
          </button>
        ))}
      </div>
      <div style={{ height: '24px' }} />
    </div>
  );
}