import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="p-8 text-center bg-surface-container-highest rounded-xl border border-error/20">
          <span className="material-symbols-outlined text-error text-4xl mb-4">gpp_bad</span>
          <h2 className="text-xl font-bold text-error">Access Denied</h2>
          <p className="text-sm text-on-surface-variant mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
