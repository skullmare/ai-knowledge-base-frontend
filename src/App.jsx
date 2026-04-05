import { useEffect } from 'react';
import useProfileStore from '@store/profile';
import AppRouter from '@router/App';

function App() {
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    if (accessToken) {
      fetchProfile()
    }
  }, []);
  return <AppRouter />;
}

export default App;