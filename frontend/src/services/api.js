import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API functions
export const urlService = {
  // Shorten URL
  shortenUrl: async (originalUrl, expiryDate = null) => {
    try {
      const payload = {
        originalUrl,
        ...(expiryDate && { expiryDate })
      };
      const response = await api.post('/api/shorten', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to shorten URL');
    }
  },

  // Get all URLs
  getAllUrls: async () => {
    try {
      const response = await api.get('/api/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch URLs');
    }
  },

  // Delete URL
  deleteUrl: async (shortCode) => {
    try {
      const response = await api.delete(`/api/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete URL');
    }
  },

  // Get redirect (for analytics)
  getRedirect: async (shortCode) => {
    try {
      const response = await api.get(`/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'URL not found');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/actuator/health');
      return response.data;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  }
};

export default api;