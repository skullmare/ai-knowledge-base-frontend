import api from './api'

export const platformRoleService = {
  getAll: async (queryParams) => {
    const { data } = await api.get('/platform/roles', { 
      params: queryParams
    });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/platform/roles/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/platform/roles', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/platform/roles/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/platform/roles/${id}`);
    return data;
  },

  deleteMany: async (ids) => {
    const { data } = await api.delete('/platform/roles/delete/many', { 
      data: { ids } 
    });
    return data;
  }
}