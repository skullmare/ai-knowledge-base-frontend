import { create } from 'zustand'
import { authService } from '@services/auth'
import { handleError } from '@utils/handleError'

const useAuthStore = create((set) => ({
  isLoadingLogin: false,
  isLoadingLogout: false,
  error: null,
  isAuthenticated: false,

  login: async (login, password) => {
    set({ isLoadingLogin: true, error: null })
    try {
      await authService.login(login, password)
      set({ isAuthenticated: true, error: null })
      return true
    } catch (err) {
      set({ error: handleError(err), isAuthenticated: false })
      return false
    } finally {
      set({ isLoadingLogin: false })
    }
  },

  logout: async () => {
    set({ isLoadingLogout: true, error: null })
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      set({ 
        isLoadingLogout: false, 
        isAuthenticated: false,
        error: null 
      })
    }
  },

}))

export default useAuthStore