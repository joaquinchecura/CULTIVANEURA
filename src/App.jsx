import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import Layout from './components/Layout';

import Home                    from './pages/Home';
import Estado                  from './pages/Estado';
import Regular                 from './pages/Regular';
import Aprender                from './pages/Aprender';
import Progreso                from './pages/Progreso';
import Juegos                  from './pages/Juegos';
import RuedaEmocional          from './pages/RuedaEmocional';
import RuedaEmocionalDashboard from './pages/RuedaEmocionalDashboard';

// ─── Note: LessonDetail removed — Aprender is now fully static (no backend lessons)
// ─── Note: Admin removed — import was missing. Re-add when the page exists:
//     import Admin from './pages/Admin';
//     <Route path="/admin" element={<Admin />} />

const LoginPage = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <SignIn routing="hash" />
  </div>
);

const AuthenticatedApp = () => (
  <>
    <SignedOut><LoginPage /></SignedOut>
    <SignedIn>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"                element={<Home />} />
          <Route path="/estado"          element={<Estado />} />
          <Route path="/regular"         element={<Regular />} />
          <Route path="/aprender"        element={<Aprender />} />
          <Route path="/progreso"        element={<Progreso />} />
          <Route path="/juegos"          element={<Juegos />} />
          <Route path="/rueda-emocional" element={<RuedaEmocional />} />
          <Route path="/rueda-dashboard" element={<RuedaEmocionalDashboard />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </SignedIn>
  </>
);

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
  );
}

export default App;