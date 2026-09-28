import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './hooks/useAdminAuth';

/**
 * Route guard do painel admin: se o token não estiver presente,
 * redireciona para a página de login. Caso contrário, renderiza
 * as rotas filhas via <Outlet />.
 */
export function AdminProtectedRoute() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
