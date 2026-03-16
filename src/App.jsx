import { useEffect } from 'react';
import useProfileStore from './store/profileStore';
import AppRouter from './router/AppRouter';

function App() {
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (token) {
      fetchProfile().catch((err) => {
        console.error("Ошибка при инициализации профиля:", err);
      });
    } else {
      useProfileStore.setState({ isInitialized: true });
    }
  }, [fetchProfile, token]);

  return <AppRouter />;
}

export default App;