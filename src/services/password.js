import api from './api'

export const passwordService = {
  change: async (payload) => {
    const { data } = await api.put('/password/change', payload);
    return data;
  },

  forgot: async (payload) => {
    const { data } = await api.post('/password/forgot', payload);
    return data;
  },

  reset: async (token, payload) => {
    const { data } = await api.post(`/password/reset/${token}`, payload);
    return data;
  }
}