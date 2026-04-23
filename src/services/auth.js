import api from './api'

export const authService = {
  login: async (login, password) => {
    const { data } = await api.post('/auth/login', { login, password })
    return data
  },

  verify2fa: async (login, code) => {
    const { data } = await api.post('/auth/verify-2fa', { login, code })
    localStorage.setItem('accessToken', data.data.accessToken)
    return data
  },

  logout: async () => {
    localStorage.removeItem('accessToken')
    const { data } = await api.post('/auth/logout', {})
    return data
  },
}