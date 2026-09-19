import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  // 1. LocalStorage theke active org id neya
  const [activeOrgId, setActiveOrgId] = useState(() => localStorage.getItem('activeOrgId'));

  // 2. Backend theke Org list anar API call
  const {
    data: userMemberships = [],
    isLoading: isLoadingOrgs,
    isError,
  } = useQuery({
    queryKey: ['my-memberships'],
    queryFn: async () => {
      const res = await api.get('/organizations');
      return res.data?.data || [];
    },
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // 3. Current active organization khunje ber kora (Shohoj 1 line code)
  const currentOrg = userMemberships.find(
    (org) => String(org._id) === String(activeOrgId)
  ) || null;

  // 4. Org switch korar function
  const switchOrg = (orgId) => {
    if (!orgId) return;
    setActiveOrgId(String(orgId));
    localStorage.setItem('activeOrgId', String(orgId));
  };

  // 5. Active Org na thakle ba invalid hole prothom Org ta auto-select kora
  useEffect(() => {
    if (userMemberships.length > 0) {
      const isValid = userMemberships.some(
        (org) => String(org._id) === String(activeOrgId)
      );

      if (!activeOrgId || !isValid) {
        switchOrg(userMemberships[0]._id);
      }
    }
  }, [activeOrgId, userMemberships]);

  return (
    <TenantContext.Provider
      value={{
        activeOrgId,
        currentOrg,
        userMemberships,
        isLoadingOrgs,
        isError,
        switchOrg,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);