import axios from 'axios';

// ✅ Create axios instance with production backend URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://url-shortener-backend-k0pv.onrender.com',
  timeout: 30000, // Increased timeout for Render free tier spin-up
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
    
    // Handle common Render.com issues
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Server is starting up, please try again in a moment...');
    }
    
    return Promise.reject(error);
  }
);

// ✅ API Functions
const urlService = {
  // 🔹 Shorten URL
  shortenUrl: async (originalUrl, expiryDate = null) => {
    try {
      const payload = {
        longUrl: originalUrl,     // ✅ Backend DTO match
        expiryAt: expiryDate,     // ✅ Backend DTO match
      };
      const response = await api.post('/api/shorten', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to shorten URL');
    }
  },

  // 🔹 Get All URLs
  getAllUrls: async () => {
    try {
      const response = await api.get('/api/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch URLs');
    }
  },

  // 🔹 Delete URL
  deleteUrl: async (shortCode) => {
    try {
      const response = await api.delete(`/api/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete URL');
    }
  },

  // 🔹 Get URL Analytics
  getUrlAnalytics: async (shortCode) => {
    try {
      const response = await api.get(`/api/analytics/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch analytics');
    }
  },

  // 🔹 Get Redirect (for direct access)
  getRedirect: async (shortCode) => {
    try {
      const response = await api.get(`/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'URL not found');
    }
  },

  // 🔹 Health Check
  healthCheck: async () => {
    try {
      const response = await api.get('/actuator/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend service unavailable');
    }
  },
};

// ✅ Export the service
export default urlService;
