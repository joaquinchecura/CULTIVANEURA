import { Outlet, NavLink } from 'react-router-dom';
import { Home, Zap, BookOpen, BarChart2, Settings, Gamepad2, User, LogOut, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClerk, useUser } from '@clerk/clerk-react';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/estado', icon: Zap, label: 'Mi Estado' },
  { to: '/rueda-emocional', icon: Heart, label: 'Emociones' },
  { to: '/aprender', icon: BookOpen, label: 'Aprender' },
  { to: '/juegos', icon: Gamepad2, label: 'Juegos' },
  { to: '/progreso', icon: BarChart2, label: 'Progreso' },
];

const bottomNavItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/estado', icon: Zap, label: 'Estado' },
  { to: '/rueda-emocional', icon: Heart, label: 'Emociones' },
  { to: '/juegos', icon: Gamepad2, label: 'Juegos' },
  { to: '/progreso', icon: BarChart2, label: 'Progreso' },
];

export default function Layout() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const fullName = user?.fullName || user?.firstName || '';
  const email = user?.primaryEmailAddress?.emailAddress || '';

  return (
    <div className="min-h-screen bg-background flex">

      {/* SIDEBAR — desktop only */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card fixed top-0 left-0 h-full z-40">
        <div className="px-6 py-8 border-b border-border">
          <p className="font-serif text-2xl text-foreground">NEURA</p>
          <p className="text-xs text-muted-foreground mt-0.5">Sistema nervioso</p>
        </div>

        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}>
              {({ isActive }) => (
                <><Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />{label}</>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink to="/admin"
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}>
              {({ isActive }) => (
                <><Settings size={18} strokeWidth={isActive ? 2.5 : 1.8} />Admin</>
              )}
            </NavLink>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button onClick={() => signOut({ redirectUrl: '/' })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-all">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto md:max-w-3xl lg:max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* BOTTOM NAV — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border px-2 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {bottomNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => cn(
                'flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}>
              {({ isActive }) => (
                <>
                  <div className={cn('p-1.5 rounded-lg transition-all', isActive ? 'bg-primary/10' : '')}>
                    <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className="text-[9px] font-medium tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
