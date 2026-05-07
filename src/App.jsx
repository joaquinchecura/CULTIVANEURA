import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Estado from './pages/Estado';
import Regular from './pages/Regular';
import Aprender from './pages/Aprender';
import LessonDetail from './pages/LessonDetail';
import Progreso from './pages/Progreso';
import Admin from './pages/Admin';
import Juegos from './pages/Juegos';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs text-muted-foreground font-sans">NEURA</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout user={user} />}>
        <Route path="/" element={<Home />} />
        <Route path="/estado" element={<Estado />} />
        <Route path="/regular" element={<Regular />} />
        <Route path="/aprender" element={<Aprender />} />
        <Route path="/aprender/:id" element={<LessonDetail />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App