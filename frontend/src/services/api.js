import axios from 'axios';

// ✅ Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor
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

// ✅ Response interceptor
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

// ✅ API Functions
const urlService = {
  // 🔹 Shorten URL
  shortenUrl: async (originalUrl, expiryDate = null) => {
    try {
      const payload = {
        longUrl: originalUrl,     // ✅ Fixed variable name
        expiryAt: expiryDate,     // ✅ Backend DTO match
      };
      const response = await api.post('/api/shorten', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to shorten URL');
    }
  },

  // 🔹 Get All URLs
  getAllUrls: async () => {
    try {
      const response = await api.get('/api/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch URLs');
    }
  },

  // 🔹 Delete URL
  deleteUrl: async (shortCode) => {
    try {
      const response = await api.delete(`/api/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete URL');
    }
  },

  // 🔹 Get Redirect (analytics)
  getRedirect: async (shortCode) => {
    try {
      const response = await api.get(`/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'URL not found');
    }
  },

  // 🔹 Health Check
  healthCheck: async () => {
    try {
      const response = await api.get('/actuator/health');
      return response.data;
    } catch (error) {
      throw new Error('Service unavailable');
    }
  },
};

// ✅ Export the service (no curly braces in import)
export default urlService;
