// src/lib/nervous-system.js
// Fuente única de verdad para los 3 estados del sistema nervioso.

export const NS_CONFIG = {
    regulado: {
      label: 'Regulado',
      emoji: '🟢',
      desc: 'Tu sistema nervioso está en equilibrio',
      dot: 'bg-emerald-500',
      bgSoft: 'bg-emerald-50',
      bgCard: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      gradient: 'from-emerald-50 to-background',
    },
    activado: {
      label: 'Activado',
      emoji: '🟡',
      desc: 'Alta activación, energía disponible',
      dot: 'bg-amber-500',
      bgSoft: 'bg-amber-50',
      bgCard: 'bg-amber-100 border-amber-300 text-amber-800',
      gradient: 'from-amber-50 to-background',
    },
    colapsado: {
      label: 'Colapsado',
      emoji: '🔴',
      desc: 'Necesitás regulación y calma',
      dot: 'bg-rose-500',
      bgSoft: 'bg-rose-50',
      bgCard: 'bg-rose-100 border-rose-300 text-rose-800',
      gradient: 'from-rose-50 to-background',
    },
  };
  
  /** Mapeo de los 3 estados del flujo "Sistema" (Estado.jsx) al estado canónico. */
  export const SYSTEM_STATE_MAP = {
    high:      'activado',
    regulated: 'regulado',
    low:       'colapsado',
  };
  
  export const NS_KEYS = ['regulado', 'activado', 'colapsado'];