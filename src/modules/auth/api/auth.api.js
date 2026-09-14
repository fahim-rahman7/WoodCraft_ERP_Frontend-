import api from '../../../api/axios';

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const fetchProfileApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};