import { Navigate } from 'react-router-dom';
import useProfileStore from '@store/profile';

const ProtectedRoute = ({ children, permission = null, permissions = null, mode = 'every' }) => {
  const token = localStorage.getItem('accessToken');
  const { permissions: userPermissions, isInitialized } = useProfileStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isInitialized) {
    const required = permissions ?? (permission ? [permission] : null);

    if (required) {
      const check = mode === 'some'
        ? required.some((p) => userPermissions.includes(p))
        : required.every((p) => userPermissions.includes(p));

      if (!check) return <Navigate to="/403" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;