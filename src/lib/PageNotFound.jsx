import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-muted">404</h1>
        <h2 className="text-2xl font-serif text-foreground">Página no encontrada</h2>
        <p className="text-muted-foreground">
          La página <span className="font-medium">"{pageName}"</span> no existe.
        </p>
        <Link to="/" className="inline-block px-4 py-2 text-sm text-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
