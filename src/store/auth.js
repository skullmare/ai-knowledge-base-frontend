import { create } from 'zustand'
import { authService } from '@services/auth'
import { handleError } from '@utils/handleError'

const useAuthStore = create((set) => ({
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (login, password) => {
    set({ isLoading: true, error: null })
    try {
      await authService.login(login, password)
      set({ isAuthenticated: true, error: null })
      return true
    } catch (err) {
      set({ error: handleError(err), isAuthenticated: false })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      set({ 
        isLoading: false, 
        isAuthenticated: false,
        error: null 
      })
    }
  },

}))

export default useAuthStore