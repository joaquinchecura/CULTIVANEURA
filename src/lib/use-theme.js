import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // Si el usuario ya eligió, respetamos su elección
    const saved = localStorage.getItem('neura-theme');
    if (saved) return saved === 'dark';
    
    // Si no eligió, forzamos modo claro por defecto
    return false; 
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('neura-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('neura-theme', 'light');
    }
  }, [isDark]);

  return { isDark, toggleTheme: () => setIsDark(!isDark) };
}