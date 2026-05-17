import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

// ─── Tus contactos (reemplazá los placeholders) ───────────────────────────────

const CONTACTS = [
  {
    id:    'whatsapp',
    label: 'WhatsApp',
    emoji: '💬',
    color: '#25D366',
    bg:    '#25D36618',
    href:  'https://wa.me/5491100000000?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20Cultiva%20Neura',
  },
  {
    id:    'instagram',
    label: 'Instagram',
    emoji: '📸',
    color: '#E1306C',
    bg:    '#E1306C18',
    href:  'https://instagram.com/cultivaneura',
  },
  {
    id:    'linkedin',
    label: 'LinkedIn',
    emoji: '💼',
    color: '#0A66C2',
    bg:    '#0A66C218',
    href:  'https://linkedin.com/in/cultivaneura',
  },
  {
    id:    'email',
    label: 'Email',
    emoji: '✉️',
    color: '#264653',
    bg:    '#26465318',
    href:  'mailto:hola@cultivaneura.com',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FloatingContact() {
  const [open, setOpen]     = useState(false);
  const containerRef        = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom:   '84px',   // above bottom nav bar (~64px) + gap
        right:    '18px',
        zIndex:   9999,
        display:  'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
      }}
    >
      {/* Contact options */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '8px',
              alignItems:    'flex-end',
            }}
          >
            {/* Label */}
            <p style={{
              fontSize:    '10px',
              fontWeight:  700,
              letterSpacing: '1.5px',
              color:       'var(--muted-foreground)',
              textTransform: 'uppercase',
              marginBottom: '2px',
              paddingRight: '4px',
            }}>
              Contacto
            </p>

            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0,  transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, x: 20,    transition: { delay: (CONTACTS.length - 1 - i) * 0.03 } }}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '10px',
                  padding:        '10px 14px',
                  borderRadius:   '16px',
                  background:     'var(--card)',
                  border:         '1px solid var(--border)',
                  boxShadow:      '0 4px 16px rgba(0,0,0,0.10)',
                  textDecoration: 'none',
                  minWidth:       '160px',
                  cursor:         'pointer',
                }}
                onClick={() => setOpen(false)}
              >
                {/* Icon bubble */}
                <div style={{
                  width:          '34px',
                  height:         '34px',
                  borderRadius:   '10px',
                  background:     c.bg,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '18px',
                  flexShrink:     0,
                }}>
                  {c.emoji}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>
                    {c.label}
                  </p>
                  <p style={{ fontSize: '10px', color: c.color, margin: 0, fontWeight: 600 }}>
                    Escribinos →
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.92 }}
        style={{
          width:          '52px',
          height:         '52px',
          borderRadius:   '50%',
          background:     open ? 'var(--foreground)' : '#264653',
          border:         'none',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      '0 6px 24px rgba(38,70,83,0.35)',
          cursor:         'pointer',
          transition:     'background 0.2s',
        }}
        aria-label="Contacto"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{ rotate: 90,    opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} color="var(--background)" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90,  opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{ rotate: -90,   opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} color="white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
