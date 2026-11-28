import api from '../../../../api/axios';

// -----get suppliers
export const getSuppliers = async ({ orgId, params } = {}) => {
  const res = await api.get('/procurement/suppliers', {
    headers: { 'x-organization-id': orgId },
    params,
  });
  return res.data;
};