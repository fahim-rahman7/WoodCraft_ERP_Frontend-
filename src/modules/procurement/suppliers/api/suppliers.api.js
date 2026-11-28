import api from '../../../../api/axios';

// -----get suppliers
export const getSuppliers = async ({ orgId, params } = {}) => {
  const res = await api.get('/procurement/suppliers', {
    headers: { 'x-organization-id': orgId },
    params,
  });
  return res.data;
};

// -----create supplier
export const createSupplier = async ({ orgId, data }) => {
  const res = await api.post('/procurement/suppliers', data, {
    headers: { 'x-organization-id': orgId },
  });
  return res.data;
};