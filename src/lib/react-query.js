import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 15,    // Inactive cache is garbage-collected after 15 minutes
      retry: 1,                  // Retry failed requests once before throwing error
      refetchOnWindowFocus: false, // Prevents background refetches when switching browser tabs
    },
    mutations: {
      retry: false,
    },
  },
});