import api from '../../../api/axios';

// Stock summary for an organization (optional filters: warehouseId, itemId, batchId)
export const getStockSummaryApi = async ({ orgId, params } = {}) => {
  const res = await api.get('/inventory/stocks/summary', {
    headers: { 'x-organization-id': orgId },
    params,
  });
  return res.data;
};
