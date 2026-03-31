import { Navigate } from 'react-router-dom';
import useProfileStore from '../store/profile';

export default function ProtectedRoute({ children, permission }) {
  const token = localStorage.getItem('accessToken');
  const { isInitialized, isLoading, checkPermission, profile } = useProfileStore();

  if (!token) return <Navigate to="/login" replace />;

  if (!isInitialized || isLoading) {
    return <div>Загрузка профиля...</div>;
  }

  if (!profile) return <Navigate to="/login" replace />;

  if (permission && !checkPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}