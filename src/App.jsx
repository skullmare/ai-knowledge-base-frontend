import { useEffect, useRef } from 'react';
import useProfileStore from '@store/profile';
import AppRouter from '@router/App';
import ErrorSnackbarStack from '@ui/Snackbar/ErrorSnackbarStack';
import SuccessSnackbarStack from '@ui/Snackbar/SuccessSnackbarStack';
import api, { setAccessToken } from '@services/api';

function App() {
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const setInitialized = useProfileStore((state) => state.setInitialized);
  const bootstrappedRef = useRef(false);

  // Восстановление сессии выполняется ровно один раз: в StrictMode эффекты
  // вызываются дважды, и без защиты уходило два запроса на /auth/refresh.
  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    if (localStorage.getItem('accessToken')) {
      fetchProfile();
      return;
    }

    api.post('/auth/refresh', {})
      .then((res) => {
        setAccessToken(res.data.data.accessToken);
        return fetchProfile();
      })
      .catch(() => setInitialized());
  }, [fetchProfile, setInitialized]);

  return (
    <>
      <AppRouter />
      <ErrorSnackbarStack />
      <SuccessSnackbarStack />
    </>
  );
}

export default App;
