// hooks/useLogout.js
import { useCallback, useState } from 'react';

export const useLogout = (logoutFunction) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutFunction();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      // Полная перезагрузка страницы и редирект - очищает все куки включая httpOnly
      window.location.href = '/login';
    }
  }, [logoutFunction]);

  const openLogoutModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    handleLogout,
    openLogoutModal,
    closeLogoutModal,
    isLogoutModalOpen: isModalOpen,
    isLogoutLoading: isLoading,
  };
};