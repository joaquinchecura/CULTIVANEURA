import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
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


const LoginPage = () => (
  <>
    <SignedIn>
      <Navigate to="/" replace />
    </SignedIn>
    <SignedOut>
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <SignIn routing="path" path="/login" fallbackRedirectUrl="/" />
      </div>
    </SignedOut>
  </>
)

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
    <Router>
      <Routes>
        <Route path="/login/*" element={<LoginPage />} />

        <Route path="/*" element={
          <>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
            <SignedIn>
              <ProtectedRoutes />
            </SignedIn>
          </>
        } />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App