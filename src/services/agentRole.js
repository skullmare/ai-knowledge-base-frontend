import api from './api'

export const agentRoleService = {
  getAll: async (queryParams) => {
    const { data } = await api.get('/agent/roles', { 
      params: queryParams
    });
    return data;
  },

  getOne: async (id) => {
    const { data } = await api.get(`/agent/roles/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/agent/roles', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/agent/roles/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/agent/roles/${id}`);
    return data;
  },

  deleteMany: async (ids) => {
    const { data } = await api.delete('/agent/roles/delete/many', { 
      data: { ids } 
    });
    return data;
  }
}