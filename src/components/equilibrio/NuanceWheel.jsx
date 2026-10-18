import React from 'react';

/**
 * NuanceWheel — presentational component for selecting emotional nuances.
 * 
 * Shows the selected system state (icon, name, sensations) at the top,
 * then 3 tappable nuance circles below.
 * 
 * Navigation is handled by the parent via `onSelect` callback.
 * No internal "Volver" or "Continuar" buttons.
 */
export default function NuanceWheel({ state, selectedNuance, onSelect }) {
  return (
    <div className="space-y-5">
      
      {/* ── State summary card ── */}
      <div className="bg-card rounded-2xl p-5 text-center border border-border">
        <div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3"
          style={{ background: `${state.color}22`, border: `2px solid ${state.color}60` }}
        >
          <span style={{ fontSize: '2.5rem' }}>{state.icon}</span>
        </div>
        <h2 className="text-xl font-serif text-foreground">{state.name}</h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          {state.sensations.join(' · ')}
        </p>
      </div>

      {/* ── Prompt ── */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Con cuál te sentís más cercano?
      </p>

      {/* ── Nuance circles ── */}
      {/* ── Nuance circles ── */}
<div className="flex justify-center gap-6">
  {state.nuances.map(nuance => {
    const isSelected = selectedNuance?.name === nuance.name;
    return (
      <button
        key={nuance.name}
        onClick={() => onSelect(nuance)}
        className={cn(
          "transition-all duration-300 focus:outline-none flex flex-col items-center gap-3",
          isSelected ? "scale-110" : "opacity-70 hover:opacity-100 hover:scale-105"
        )}
      >
        {/* Círculo con color de fondo y borde */}
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors"
          style={{
            background: isSelected ? state.color : 'var(--card)',
            borderColor: isSelected ? state.color : 'var(--border)',
            color: isSelected ? 'white' : 'var(--muted-foreground)',
          }}
        >
          {/* Acá podés mapear el emoji a un ícono de Lucide si querés, 
              o dejar el emoji pero con tamaño normal */}
          <span className="text-3xl">{nuance.emoji}</span>
        </div>
        
        {/* Texto debajo del círculo */}
        <span className={cn("text-xs font-semibold", isSelected ? "text-foreground" : "text-muted-foreground")}>
          {nuance.name}
        </span>
      </button>
    );
  })}
</div>

      {/* ── Micro-learning card (shown only when a nuance is selected) ── */}
      {selectedNuance && (
        <div
          className="rounded-2xl p-5 text-center border-2"
          style={{ background: 'var(--card)', borderColor: `${state.color}40` }}
        >
          <span className="text-2xl mb-2 block">💡</span>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            "{selectedNuance.learning}"
          </p>
        </div>
      )}
    </div>
  );
}