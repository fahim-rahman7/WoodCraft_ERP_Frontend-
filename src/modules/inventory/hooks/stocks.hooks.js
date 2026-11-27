import { useQuery } from '@tanstack/react-query';
import { getStockSummaryApi } from '../api/stocks.api';

export const useStockSummary = (orgId, params) => {
  return useQuery({
    queryKey: ['stocks', 'summary', orgId, params],
    queryFn: () => getStockSummaryApi({ orgId, params }),
    select: (response) => response?.data || [],
    enabled: !!orgId,
  });
};
