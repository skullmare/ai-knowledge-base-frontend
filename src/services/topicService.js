import api from './api'

export const topicService = {
  getAll: async (queryParams) => {
    const { data } = await api.get('/topics', { 
      params: queryParams
    });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/topics/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/topics', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/topics/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/topics/${id}`);
    return data;
  },

  approve: async (id) => {
    const { data } = await api.patch(`/topics/${id}`, { status: 'approved' });
    return data;
  }
}