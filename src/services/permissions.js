import api from './api';

export const permissionsService = {
  getPermissions: async () => {
    const { data } = await api.get('/permissions');
    return data; 
  },
};