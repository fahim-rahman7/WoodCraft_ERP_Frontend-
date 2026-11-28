import api from '../../../../api/axios';

// -----get suppliers
export const getSuppliers = async () => {
  const res = await api.get('/procurement/suppliers');
  return res.data;
};