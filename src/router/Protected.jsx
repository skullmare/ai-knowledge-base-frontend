import { Navigate } from 'react-router-dom';
import useProfileStore from '@store/profile';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const token = localStorage.getItem('accessToken');
  const { permissions, isInitialized } = useProfileStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredPermission && isInitialized) {
    const hasPermission = permissions.includes(requiredPermission);
    if (!hasPermission) return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;