import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Zap, BookOpen, BarChart2, Settings, Gamepad2, Menu, User, LogOut, Heart } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio', end: true },
  { to: '/estado', icon: Zap, label: 'Mi Estado' },
  { to: '/rueda-emocional', icon: Heart, label: 'Emociones' },
  { to: '/aprender', icon: BookOpen, label: 'Aprender' },
  { to: '/juegos', icon: Gamepad2, label: 'Juegos' },
  { to: '/progreso', icon: BarChart2, label: 'Progreso' },
];

export default function HomeDrawer() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();

  const fullName = user?.fullName || user?.firstName || '';
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const isAdmin = user?.publicMetadata?.role === 'admin';

  function handleLogout() {
    signOut({ redirectUrl: '/' });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl hover:bg-muted transition-colors"
        aria-label="Menú"
      >
        <Menu size={22} className="text-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 pt-12 pb-6 border-b border-border">
                <div>
                  <p className="font-serif text-xl text-foreground">NEURA</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sistema nervioso</p>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              {user && (
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label, end }) => {
                  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
                  return (
                    <Link
                      key={to} 
                      to={to} 
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                      {label}
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin" 
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Settings size={18} /> Admin
                  </Link>
                )}
              </nav>

              {/* FIX: Padding bottom para que el botón no quede tapado por el bottom nav */}
              <div className="px-3 py-4 border-t border-border pb-24 md:pb-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-all"
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}