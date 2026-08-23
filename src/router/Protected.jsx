import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useProfileStore from '@store/profile';
import api, { setAccessToken } from '@services/api';

const ProtectedRoute = ({ children, permission = null, permissions = null, mode = 'every' }) => {
  const { permissions: userPermissions, isInitialized, fetchProfile } = useProfileStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const token = localStorage.getItem('accessToken');
  const needsRefresh = isInitialized && !token && !isRefreshing && !redirectToLogin;

  useEffect(() => {
    if (!needsRefresh) return;
    setIsRefreshing(true);
    api.post('/auth/refresh', {})
      .then((res) => {
        setAccessToken(res.data.data.accessToken);
        return fetchProfile();
      })
      .catch(() => setRedirectToLogin(true))
      .finally(() => setIsRefreshing(false));
  }, [needsRefresh]);

  if (!isInitialized || isRefreshing || needsRefresh) return null;
  if (!token || redirectToLogin) return <Navigate to="/login" replace />;

  const required = permissions ?? (permission ? [permission] : null);
  if (required) {
    const check = mode === 'some'
      ? required.some((p) => userPermissions.includes(p))
      : required.every((p) => userPermissions.includes(p));
    if (!check) return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;