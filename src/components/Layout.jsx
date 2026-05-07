import { Outlet, NavLink } from 'react-router-dom';
import { Home, Zap, BookOpen, BarChart2, Settings, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/estado', icon: Zap, label: 'Estado' },
  { to: '/regular', icon: Zap, label: 'Regular', hidden: true },
  { to: '/aprender', icon: BookOpen, label: 'Aprender' },
  { to: '/juegos', icon: Gamepad2, label: 'Juegos' },
  { to: '/progreso', icon: BarChart2, label: 'Progreso' },
  { to: '/admin', icon: Settings, label: 'Admin', adminOnly: true },
];

export default function Layout({ user }) {
  const isAdmin = user?.role === 'admin';

  const visibleItems = navItems.filter(item => !item.hidden && (!item.adminOnly || isAdmin));

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <main className="flex-1 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/90 backdrop-blur-md border-t border-border px-4 py-3 z-50">
        <div className="flex justify-around items-center">
          {visibleItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'p-1.5 rounded-lg transition-all',
                    isActive ? 'bg-primary/10' : ''
                  )}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}