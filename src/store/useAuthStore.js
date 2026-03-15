import { create } from 'zustand'
import { authService } from '../services/authService'
import { handleError } from '../utils/handleError'

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (login, password) => {
    set({ isLoading: true, error: null })
    try {
      await authService.login(login, password)
      set({ user: { login } })
    } catch (err) {
      set({ error: handleError(err) })
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null })
  },
}))

export default useAuthStore