import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axios';

// Role অনুযায়ী সঠিক API কল করার ফাংশন
const fetchDashboardData = async (orgId, role) => {
  let endpoint = '/dashboard/owner'; // Default fallback
  
  if (role === 'MANAGER') {
    endpoint = '/dashboard/manager';
  } else if (role === 'HR') {
    endpoint = '/dashboard/hr';
  } else if (role === 'OWNER') {
    endpoint = '/dashboard/owner';
  }

  const { data } = await api.get(endpoint, {
    headers: { 'x-organization-id': orgId },
  });
  return data.data;
};

export const useDashboard = (orgId, role) => {
  return useQuery({
    queryKey: ['dashboard', orgId, role],
    queryFn: () => fetchDashboardData(orgId, role),
    enabled: !!orgId && !!role,
  });
};