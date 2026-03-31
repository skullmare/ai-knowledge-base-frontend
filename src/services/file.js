import api from './api'

export const fileService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  }
}