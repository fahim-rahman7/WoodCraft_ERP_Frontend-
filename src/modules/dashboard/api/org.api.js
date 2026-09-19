import api from '../../../api/axios';

export const createOrgApi = async (payload) => {
  // Matches route: router.post('/create', ...)
  const res = await api.post('/organizations/create', payload);
  return res.data;
};

export const initiateCheckoutApi = async (payload) => {
  const res = await api.post('/billing/checkout', payload);
  return res.data;
};