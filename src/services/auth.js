import api from './api'

export const authService = {
  login: async (login, password) => {
    const { data } = await api.post('/auth/login', { login, password }, { skipAuthRefresh: true })
    localStorage.setItem('accessToken', data.data.accessToken)
    return data
  },

  logout: () => {
    localStorage.removeItem('accessToken')
  },
}