import api from '../../../api/axios';

export const loginApi = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const registerApi = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const verifyOtpApi = async (data) => {
  const res = await api.post('/auth/verify-otp', data);
  return res.data;
};

export const resendOtpApi = async (data) => {
  const res = await api.post('/auth/resend-otp', data);
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};