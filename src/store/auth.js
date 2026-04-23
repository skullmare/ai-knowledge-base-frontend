import { create } from 'zustand'
import { authService } from '@services/auth'
import { handleError } from '@utils/handleError'

const useAuthStore = create((set, get) => ({
  isLoadingLogin: false,
  isLoadingLogout: false,
  isLoadingVerify: false,
  error: null,
  isAuthenticated: false,
  pendingLogin: null,

  login: async (login, password) => {
    set({ isLoadingLogin: true, error: null })
    try {
      await authService.login(login, password)
      set({ pendingLogin: login, error: null })
      return true
    } catch (err) {
      set({ error: handleError(err) })
      return false
    } finally {
      set({ isLoadingLogin: false })
    }
  },

  verify2fa: async (code) => {
    const { pendingLogin } = get()
    set({ isLoadingVerify: true, error: null })
    try {
      await authService.verify2fa(pendingLogin, code)
      set({ isAuthenticated: true, pendingLogin: null, error: null })
      return true
    } catch (err) {
      set({ error: handleError(err) })
      return false
    } finally {
      set({ isLoadingVerify: false })
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
        error: null,
      })
    }
  },
}))

export default useAuthStore
