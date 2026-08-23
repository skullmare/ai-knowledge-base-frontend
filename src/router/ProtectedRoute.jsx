import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import useProfileStore from '@store/profile';
import api, { setAccessToken } from '@services/api';

const REFRESH_IDLE = 'idle';
const REFRESH_DONE = 'done';
const REFRESH_FAILED = 'failed';

const ProtectedRoute = ({ children, permission = null, permissions = null, mode = 'every' }) => {
  const { permissions: userPermissions, isInitialized, fetchProfile } = useProfileStore();
  const [refreshState, setRefreshState] = useState(REFRESH_IDLE);
  const refreshStartedRef = useRef(false);

  const token = localStorage.getItem('accessToken');
  const needsRefresh = isInitialized && !token && refreshState === REFRESH_IDLE;

  // Состояние меняется только в колбэках запроса: синхронный setState
  // в теле эффекта запускал каскад лишних рендеров.
  useEffect(() => {
    if (!needsRefresh || refreshStartedRef.current) return;
    refreshStartedRef.current = true;

    api.post('/auth/refresh', {})
      .then((res) => {
        setAccessToken(res.data.data.accessToken);
        return fetchProfile();
      })
      .then(() => setRefreshState(REFRESH_DONE))
      .catch(() => setRefreshState(REFRESH_FAILED));
  }, [needsRefresh, fetchProfile]);

  if (!isInitialized) return null;
  if (refreshState === REFRESH_FAILED) return <Navigate to="/login" replace />;
  if (!token) return null;

  const required = permissions ?? (permission ? [permission] : null);

  if (required) {
    const granted = mode === 'some'
      ? required.some((item) => userPermissions.includes(item))
      : required.every((item) => userPermissions.includes(item));

    if (!granted) return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
