import { useEffect } from 'react';
import useProfileStore from '@store/profile';
import AppRouter from '@router/App';
import ErrorSnackbarStack from '@ui/Snackbar/ErrorSnackbarStack'
import SuccessSnackbarStack from '@ui/Snackbar/SuccessSnackbarStack'
import api, { setAccessToken } from '@services/api'

function App() {
  console.log('API URL:', import.meta.env.VITE_API_URL)
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const setInitialized = useProfileStore((state) => state.setInitialized);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchProfile();
    } else {
      api.post('/auth/refresh', {})
        .then((res) => {
          setAccessToken(res.data.data.accessToken);
          fetchProfile();
        })
        .catch(() => {
          setInitialized();
        });
    }
  }, []);

  return (
    <>
      <AppRouter />
      <ErrorSnackbarStack />
      <SuccessSnackbarStack />
    </>
  )
}

export default App;