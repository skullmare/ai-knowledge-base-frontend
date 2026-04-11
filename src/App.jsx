import { useEffect } from 'react';
import useProfileStore from '@store/profile';
import AppRouter from '@router/App';
import ErrorSnackbarStack from '@ui/Snackbar/ErrorSnackbarStack'

function App() {
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    if (accessToken) {
      fetchProfile()
    }
  }, []);
  return (
    <>
      <AppRouter />
      <ErrorSnackbarStack />
    </>
  )
}

export default App;