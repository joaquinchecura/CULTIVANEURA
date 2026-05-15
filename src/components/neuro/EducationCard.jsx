import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function EducationCard({ card }) {
  const [open, setOpen] = useState(false);
  const color = card.color || '#264653';

  const Tag = ({ item }) => (
    <span className="px-2.5 py-1 rounded-xl text-xs font-semibold" style={{ background: `${color}18`, color }}>
      {item}
    </span>
  );

  const Section = ({ label, items }) =>
    items?.length > 0 ? (
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#ADB5BD', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</p>
        <div className="flex flex-wrap gap-1.5">{items.map((item, i) => <Tag key={i} item={item} />)}</div>
      </div>
    ) : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(38,70,83,0.05)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div className="flex-1">
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#264653' }}>{card.title}</p>
          <p style={{ fontSize: '12px', color: '#6C757D', marginTop: '2px', lineHeight: 1.4 }}>{card.content}</p>
        </div>
        {open
          ? <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#ADB5BD' }} />
          : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#ADB5BD' }} />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#F0F2F5] pt-3">
          <Section label="Ejemplos" items={card.examples} />
          <Section label="Funciones" items={card.functions} />
          <Section label="Efectos" items={card.effects} />
          <Section label="Herramientas" items={card.tools} />
          <Section label="Beneficios" items={card.benefits} />
          <Section label="Fases" items={card.phases} />
          <Section label="Hormonas" items={card.hormones} />

          {card.example && (
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#ADB5BD', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Ejemplo</p>
              <p style={{ fontSize: '13px', color: '#264653', lineHeight: 1.5 }}>{card.example}</p>
            </div>
          )}

          {card.tip && (
            <div className="rounded-xl px-4 py-3" style={{ background: '#264653' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#E9C46A', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Tip Cultiva</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{card.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}