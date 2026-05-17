import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react'
import PageNotFound from './lib/PageNotFound'
import Layout from './components/Layout'

import Home                    from './pages/Home'
import Estado                  from './pages/Estado'
import Regular                 from './pages/Regular'
import Aprender                from './pages/Aprender'
import Progreso                from './pages/Progreso'
import Juegos                  from './pages/Juegos'
import RuedaEmocional          from './pages/RuedaEmocional'
import RuedaEmocionalDashboard from './pages/RuedaEmocionalDashboard'
import FloatingContact         from './components/FloatingContact'

// Página de login dedicada (accesible por URL)
const LoginPage = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <SignIn routing="path" path="/login" fallbackRedirectUrl="/" />
  </div>
)

// Rutas protegidas: solo accesibles si estás logueado
const ProtectedRoutes = () => (
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
)

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Todo lo demás: si no estás logueado, redirige a /login */}
          <Route path="/*" element={
            <>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
              <SignedIn>
                <ProtectedRoutes />
                <FloatingContact />
              </SignedIn>
            </>
          } />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}

export default App