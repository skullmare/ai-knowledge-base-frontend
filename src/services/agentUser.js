import api from './api'

export const agentUserService = {
  getAll: async (queryParams) => {
    const { data } = await api.get('/agent/users', { 
      params: queryParams
    });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/agent/users/${id}`);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/agent/users/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/agent/users/${id}`);
    return data;
  }
}