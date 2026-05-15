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
        <h2 className="text-xl font-bold text-foreground">{state.name}</h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          {state.sensations.join(' · ')}
        </p>
      </div>

      {/* ── Prompt ── */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Con cuál te sentís más cercano?
      </p>

      {/* ── Nuance circles ── */}
      <div className="flex justify-center gap-5">
        {state.nuances.map(nuance => {
          const isSelected = selectedNuance?.name === nuance.name;
          return (
            <button
              key={nuance.name}
              onClick={() => onSelect(nuance)}
              className="transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                width: '95px',
                height: '95px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: isSelected ? state.color : 'var(--card)',
                color: isSelected ? 'white' : 'var(--foreground)',
                boxShadow: isSelected
                  ? '0 6px 20px rgba(0,0,0,0.15)'
                  : '0 4px 12px rgba(0,0,0,0.08)',
                border: `3px solid ${isSelected ? state.color : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '2.2rem', marginBottom: '2px' }}>
                {nuance.emoji}
              </span>
              <span className="text-[11px] font-bold">
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
          <p
            className="text-sm text-muted-foreground leading-relaxed italic"
            style={{ fontStyle: 'italic' }}
          >
            "{selectedNuance.learning}"
          </p>
        </div>
      )}
    </div>
  );
}