import api from './api'

export const googleDriveService = {
  getStatus: async () => {
    const { data } = await api.get('/google-drive/status')
    return data
  },

  getAuthUrl: async () => {
    const { data } = await api.get('/google-drive/auth-url')
    return data
  },

  connect: async (code) => {
    const { data } = await api.post('/google-drive/connect', { code })
    return data
  },

  disconnect: async () => {
    const { data } = await api.post('/google-drive/disconnect')
    return data
  },

  listFiles: async (params) => {
    const { data } = await api.get('/google-drive/files', { params })
    return data
  },
}
