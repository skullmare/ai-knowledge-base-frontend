import api from './api'

export const logService = {
  getAll: async (queryParams) => {
    const { data } = await api.get('/logs', { 
      params: queryParams
    });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/logs/${id}`);
    return data;
  }
}