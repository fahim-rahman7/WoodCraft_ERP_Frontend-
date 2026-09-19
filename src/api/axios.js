import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach Auth Token & Active Organization Context Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const activeOrgId = localStorage.getItem('activeOrgId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeOrgId) {
      config.headers['x-organization-id'] = activeOrgId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop on auth endpoints failing
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/auth/refresh');
        
        // Handle both nested backend payload formats safely
        const newToken = res.data?.data?.accessToken || res.data?.accessToken;

        if (newToken) {
          localStorage.setItem('accessToken', newToken);

          // Support header assignment for standard Axios and Axios v1+
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          if (originalRequest.headers.set) {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          }

          // Retry the failed original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('activeOrgId');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;