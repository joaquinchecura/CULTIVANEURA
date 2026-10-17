// src/lib/storage.js
// Capa de acceso a localStorage unificada para toda la app.

export const LS_KEYS = {
    CHECKINS:  'neura_checkins',
    SISTEMA:   'neura_sistema_checkins',
    EMOTIONAL: 'neura_emotional_checkins',
    LESSONS:   'neura_lessons',
  };
  
  export function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  }
  
  export function lsSet(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  /** Guardar un registro nuevo y devolverlo (con id + created_date). */
  export function lsCreate(key, record) {
    const all = lsGet(key);
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const item = { ...record, id, created_date: new Date().toISOString() };
    lsSet(key, [item, ...all]);
    return item;
  }
  
  /** Filtrar por igualdad, ordenar por created_date desc, limitar a N. */
  export function lsFilter(key, filterObj = {}, limitN = 50) {
    let all = lsGet(key);
    Object.entries(filterObj).forEach(([k, v]) => {
      all = all.filter(item => item[k] === v);
    });
    all.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return all.slice(0, limitN);
  }
  
  /** Fecha de hoy en formato YYYY-MM-DD. */
  export function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }
  
  /** Parsear fecha de forma defensiva (acepta YYYY-MM-DD o ISO completo). */
  export function safeParseDate(d) {
    if (!d) return null;
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d + 'T00:00:00');
      return new Date(d);
    } catch { return null; }
  }