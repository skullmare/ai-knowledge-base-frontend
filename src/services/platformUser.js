import api from './api'

export const userService = {
  getAll: async (queryParams) => {
    const { data } = await api.get('/users', { 
      params: queryParams
    });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/users', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  }
}