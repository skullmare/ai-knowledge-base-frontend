import api from './api'

export const topicCategoryService = {
  getAll: async (queryParams) => {
    const { data } = await api.get('/topic/categories', { 
      params: queryParams
    });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/topic/categories/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/topic/categories', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/topic/categories/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/topic/categories/${id}`);
    return data;
  },

  deleteMany: async (ids) => {
    const { data } = await api.delete('/topic/categories/delete/many', { 
      data: { ids } 
    });
    return data;
  }
}