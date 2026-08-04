import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return <div className="empty">Loading…</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}