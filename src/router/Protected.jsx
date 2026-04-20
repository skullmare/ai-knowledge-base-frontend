import { Navigate } from 'react-router-dom';
import useProfileStore from '@store/profile';

const ProtectedRoute = ({ children, permission = null }) => {
  const token = localStorage.getItem('accessToken');
  const { permissions, isInitialized } = useProfileStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (permission && isInitialized) {
    const hasPermission = permissions.includes(permission);
    if (!hasPermission) return <Navigate to="/403" replace />;
  }
  
  return children;
};

export default ProtectedRoute;