import api from './api';

export const profileService = {
  getProfile: async () => {
    const { data } = await api.get('/profile');
    return data; 
  },

  updateProfile: async (payload) => {
    const { data } = await api.patch('/profile', payload);
    return data;
  }
};