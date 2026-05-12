// Rueda de Plutchik — 8 emociones primarias con intensidades y técnicas

export const EMOTIONS = [
  {
    id: 'alegria',
    name: 'Alegría',
    emoji: '😊',
    color: '#F4C430',
    opposite: 'tristeza',
    intensities: ['Serenidad', 'Alegría', 'Éxtasis'],
    description: 'Sensación de bienestar y satisfacción',
    techniques: [
      { id: 'gratitud', name: 'Diario de Gratitud', emoji: '📓', category: 'bienestar', duration: '5 min', description: 'Escribí 3 cosas por las que estás agradecido hoy', color: '#F4C430' },
      { id: 'movimiento', name: 'Movimiento Express', emoji: '🏃', category: 'actividad', duration: '10 min', description: 'Aprovechá la energía con movimiento libre', color: '#6BCB77' },
      { id: 'social', name: 'Conectá con alguien', emoji: '🤝', category: 'social', duration: '15 min', description: 'Compartí tu bienestar con alguien cercano', color: '#4D96FF' },
    ]
  },
  {
    id: 'confianza',
    name: 'Confianza',
    emoji: '🤝',
    color: '#6BCB77',
    opposite: 'miedo',
    intensities: ['Aceptación', 'Confianza', 'Admiración'],
    description: 'Seguridad en uno mismo y en los demás',
    techniques: [
      { id: 'afirmaciones', name: 'Afirmaciones', emoji: '💪', category: 'bienestar', duration: '5 min', description: 'Reforzá tu autoconfianza con afirmaciones positivas', color: '#6BCB77' },
      { id: 'objetivo', name: 'Definí un objetivo', emoji: '🎯', category: 'actividad', duration: '10 min', description: 'Usá este estado para avanzar en algo importante', color: '#F4C430' },
      { id: 'nutricion', name: 'Nutrición consciente', emoji: '🥗', category: 'nutricion', duration: '20 min', description: 'Preparate una comida nutritiva y disfrútala', color: '#2A9D8F' },
    ]
  },
  {
    id: 'miedo',
    name: 'Miedo',
    emoji: '😨',
    color: '#9B59B6',
    opposite: 'confianza',
    intensities: ['Aprensión', 'Miedo', 'Terror'],
    description: 'Respuesta ante una amenaza percibida',
    techniques: [
      { id: 'respiracion', name: 'Respiración 4-7-8', emoji: '🫁', category: 'regulacion', duration: '5 min', description: 'Activá el sistema parasimpático con esta técnica', color: '#9B59B6' },
      { id: 'grounding', name: 'Técnica 5-4-3-2-1', emoji: '⚓', category: 'regulacion', duration: '5 min', description: 'Ancláte al presente con tus sentidos', color: '#4D96FF' },
      { id: 'meditacion', name: 'Meditación guiada', emoji: '🧘', category: 'mindfulness', duration: '10 min', description: 'Observá el miedo sin juzgarlo', color: '#6BCB77' },
      { id: 'actividad_suave', name: 'Caminata suave', emoji: '🚶', category: 'actividad', duration: '15 min', description: 'El movimiento suave regula el sistema nervioso', color: '#2A9D8F' },
    ]
  },
  {
    id: 'sorpresa',
    name: 'Sorpresa',
    emoji: '😲',
    color: '#4D96FF',
    opposite: 'anticipacion',
    intensities: ['Distracción', 'Sorpresa', 'Asombro'],
    description: 'Respuesta ante algo inesperado',
    techniques: [
      { id: 'mindfulness', name: 'Pausa mindful', emoji: '🌿', category: 'mindfulness', duration: '5 min', description: 'Tomá un momento para procesar lo que pasó', color: '#4D96FF' },
      { id: 'escritura', name: 'Escritura expresiva', emoji: '✍️', category: 'bienestar', duration: '10 min', description: 'Escribí sobre lo que sentís sin filtro', color: '#F4C430' },
    ]
  },
  {
    id: 'tristeza',
    name: 'Tristeza',
    emoji: '😢',
    color: '#5B8FA8',
    opposite: 'alegria',
    intensities: ['Melancolía', 'Tristeza', 'Pena'],
    description: 'Sensación de pérdida o dolor emocional',
    techniques: [
      { id: 'autocompasion', name: 'Autocompasión', emoji: '💙', category: 'bienestar', duration: '10 min', description: 'Tratáte con la misma gentileza que a un amigo', color: '#5B8FA8' },
      { id: 'movimiento_suave', name: 'Yoga suave', emoji: '🧘', category: 'actividad', duration: '15 min', description: 'El movimiento gentil libera emociones bloqueadas', color: '#6BCB77' },
      { id: 'social2', name: 'Buscá compañía', emoji: '🫂', category: 'social', duration: '30 min', description: 'Compartir el dolor lo alivia', color: '#4D96FF' },
      { id: 'nutricion2', name: 'Comida reconfortante', emoji: '🍲', category: 'nutricion', duration: '20 min', description: 'Preparáte algo cálido y nutritivo', color: '#2A9D8F' },
    ]
  },
  {
    id: 'disgusto',
    name: 'Disgusto',
    emoji: '🤢',
    color: '#7D9B3E',
    opposite: 'confianza',
    intensities: ['Aburrimiento', 'Disgusto', 'Repulsión'],
    description: 'Rechazo ante algo que va contra tus valores',
    techniques: [
      { id: 'limite', name: 'Establecé un límite', emoji: '🛑', category: 'bienestar', duration: '10 min', description: 'El disgusto señala tus valores — actuá desde ahí', color: '#7D9B3E' },
      { id: 'respiracion2', name: 'Respiración diafragmática', emoji: '🫁', category: 'regulacion', duration: '5 min', description: 'Soltá la tensión física asociada', color: '#9B59B6' },
      { id: 'juego', name: 'Juego cognitivo', emoji: '🧠', category: 'juegos', duration: '10 min', description: 'Redirigí la energía hacia un desafío mental', color: '#F4C430' },
    ]
  },
  {
    id: 'enojo',
    name: 'Enojo',
    emoji: '😠',
    color: '#E07A5F',
    opposite: 'miedo',
    intensities: ['Molestia', 'Enojo', 'Rabia'],
    description: 'Respuesta ante una injusticia o frustración',
    techniques: [
      { id: 'ejercicio', name: 'Ejercicio intenso', emoji: '🏋️', category: 'actividad', duration: '20 min', description: 'Canalizá la energía del enojo en movimiento', color: '#E07A5F' },
      { id: 'box_breathing', name: 'Box Breathing', emoji: '📦', category: 'regulacion', duration: '5 min', description: 'Respiración cuadrada para bajar la activación', color: '#4D96FF' },
      { id: 'escritura2', name: 'Escritura de descarga', emoji: '✍️', category: 'bienestar', duration: '10 min', description: 'Escribí todo lo que sentís sin filtro, después tiralo', color: '#F4C430' },
      { id: 'caminar', name: 'Caminata rápida', emoji: '🚶', category: 'actividad', duration: '15 min', description: 'Sacá la energía moviéndote al aire libre', color: '#6BCB77' },
    ]
  },
  {
    id: 'anticipacion',
    name: 'Anticipación',
    emoji: '🤩',
    color: '#F4A261',
    opposite: 'sorpresa',
    intensities: ['Interés', 'Anticipación', 'Vigilancia'],
    description: 'Expectativa positiva ante algo que viene',
    techniques: [
      { id: 'planificacion', name: 'Planificación consciente', emoji: '📋', category: 'bienestar', duration: '10 min', description: 'Canalizá la anticipación en acciones concretas', color: '#F4A261' },
      { id: 'visualizacion', name: 'Visualización', emoji: '🌟', category: 'mindfulness', duration: '10 min', description: 'Visualizá el resultado positivo que esperás', color: '#6BCB77' },
      { id: 'nutricion3', name: 'Hidratación y nutrición', emoji: '💧', category: 'nutricion', duration: '5 min', description: 'Preparáte física y mentalmente', color: '#2A9D8F' },
    ]
  },
];

export const EMOTIONS_MAP = Object.fromEntries(EMOTIONS.map(e => [e.id, e]));

export const CATEGORY_LABELS = {
  regulacion: { label: 'Regulación', color: '#9B59B6', emoji: '🫁' },
  actividad: { label: 'Actividad física', color: '#6BCB77', emoji: '🏃' },
  mindfulness: { label: 'Mindfulness', color: '#4D96FF', emoji: '🧘' },
  bienestar: { label: 'Bienestar', color: '#F4C430', emoji: '✨' },
  nutricion: { label: 'Nutrición', color: '#2A9D8F', emoji: '🥗' },
  social: { label: 'Social', color: '#E07A5F', emoji: '🤝' },
  juegos: { label: 'Juegos', color: '#F4A261', emoji: '🧠' },
};
