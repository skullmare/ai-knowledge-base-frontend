import api from './api'

export const systemSettingsService = {
  getAll: async () => {
    const { data } = await api.get('/system/settings')
    return data
  },

  update: async (settings) => {
    const { data } = await api.patch('/system/settings', { settings })
    return data
  },

  getModels: async () => {
    const { data } = await api.get('/system/settings/ai/models')
    return data
  },

  testConnection: async (payload = {}) => {
    const { data } = await api.post('/system/settings/ai/test', payload)
    return data
  },

  recreateCollection: async () => {
    const { data } = await api.post('/system/settings/qdrant/recreate')
    return data
  },
}
