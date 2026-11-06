import api from '../../../api/axios';

export const createCheckoutApi = async ({ plan, cusPhone }) => {
  const response = await api.post('/billing/checkout', { plan, cusPhone });
  return response.data; // returns { gatewayUrl }
};