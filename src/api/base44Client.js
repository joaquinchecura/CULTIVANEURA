// base44Client.js — Base44 replaced with localStorage
// Drop-in replacement: same API surface, data stored locally

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const getCollection = (name) => {
  try {
    return JSON.parse(localStorage.getItem(`neura_${name}`) || '[]');
  } catch { return []; }
};

const saveCollection = (name, data) => {
  localStorage.setItem(`neura_${name}`, JSON.stringify(data));
};

const makeEntity = (collectionName) => ({
  list: (sortKey = '-created_date', limit = 50) => {
    let items = getCollection(collectionName);
    const desc = sortKey.startsWith('-');
    const key = sortKey.replace('-', '');
    items = items.sort((a, b) => {
      const av = a[key] || '';
      const bv = b[key] || '';
      return desc ? bv.localeCompare(av) : av.localeCompare(bv);
    });
    return Promise.resolve(items.slice(0, limit));
  },
  filter: (filters = {}, sortKey = '-created_date', limit = 50) => {
    let items = getCollection(collectionName);
    items = items.filter(item =>
      Object.entries(filters).every(([k, v]) => item[k] === v)
    );
    const desc = sortKey.startsWith('-');
    const key = sortKey.replace('-', '');
    items = items.sort((a, b) => {
      const av = a[key] || '';
      const bv = b[key] || '';
      return desc ? bv.localeCompare(av) : av.localeCompare(bv);
    });
    return Promise.resolve(items.slice(0, limit));
  },
  create: (data) => {
    const items = getCollection(collectionName);
    const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
    items.push(newItem);
    saveCollection(collectionName, items);
    return Promise.resolve(newItem);
  },
  update: (id, data) => {
    const items = getCollection(collectionName);
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) items[idx] = { ...items[idx], ...data };
    saveCollection(collectionName, items);
    return Promise.resolve(items[idx]);
  },
  delete: (id) => {
    const items = getCollection(collectionName).filter(i => i.id !== id);
    saveCollection(collectionName, items);
    return Promise.resolve({ success: true });
  },
});

export const base44 = {
  auth: {
    me: () => {
      const user = JSON.parse(localStorage.getItem('neura_current_user') || 'null');
      return user ? Promise.resolve(user) : Promise.reject(new Error('Not authenticated'));
    },
    logout: (redirect = '/') => {
      window.location.href = redirect;
    },
  },
  entities: {
    CheckIn: makeEntity('checkins'),
    NeuroLesson: makeEntity('neuro_lessons'),
    Intervention: makeEntity('interventions'),
    UserProgress: makeEntity('user_progress'),
  },
};
