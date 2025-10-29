import axios from "axios";

<<<<<<< HEAD
// ✅ Base Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // e.g. https://url-shortener-backend-k0pv.onrender.com/api
  headers: { "Content-Type": "application/json" },
=======
// ✅ Create axios instance with production backend URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://url-shortener-backend-k0pv.onrender.com',
  timeout: 30000, // Increased timeout for Render free tier spin-up
  headers: {
    'Content-Type': 'application/json',
  },
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
});

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
<<<<<<< HEAD
    console.error("❌ API Response Error:", error.response?.status, error.message);
=======
    console.error('❌ API Response Error:', error.response?.status, error.message);
    
    // Handle common Render.com issues
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Server is starting up, please try again in a moment...');
    }
    
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
    return Promise.reject(error);
  }
);

// ✅ API Service Functions
const urlService = {
  // 🔹 Create Short URL
  shortenUrl: async (originalUrl, expiryDate = null) => {
    try {
      const payload = {
<<<<<<< HEAD
        longUrl: originalUrl, // matches backend @RequestBody field
        expiryAt: expiryDate, // optional expiry date
=======
        longUrl: originalUrl,     // ✅ Backend DTO match
        expiryAt: expiryDate,     // ✅ Backend DTO match
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
      };
      const response = await api.post("/shorten", payload);
      return response.data;
    } catch (error) {
<<<<<<< HEAD
      throw new Error(error.response?.data?.message || "Failed to shorten URL");
=======
      throw new Error(error.response?.data?.message || error.message || 'Failed to shorten URL');
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
    }
  },

  // 🔹 Get All URLs (Dashboard)
  getAllUrls: async () => {
    try {
      const response = await api.get("/all");
      return response.data;
    } catch (error) {
<<<<<<< HEAD
      throw new Error(error.response?.data?.message || "Failed to fetch URLs");
=======
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch URLs');
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
    }
  },

  // 🔹 Delete URL by short code
  deleteUrl: async (shortCode) => {
    try {
      const response = await api.delete(`/delete/${shortCode}`);
      return response.data;
    } catch (error) {
<<<<<<< HEAD
      throw new Error(error.response?.data?.message || "Failed to delete URL");
    }
  },

  // 🔹 Get Redirect / Analytics
=======
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
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
  getRedirect: async (shortCode) => {
    try {
      const response = await api.get(`/${shortCode}`);
      return response.data;
    } catch (error) {
<<<<<<< HEAD
      throw new Error(error.response?.data?.message || "URL not found");
=======
      throw new Error(error.response?.data?.message || error.message || 'URL not found');
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
    }
  },

  // 🔹 Health Check (optional)
  healthCheck: async () => {
    try {
      const response = await api.get("/actuator/health");
      return response.data;
    } catch (error) {
<<<<<<< HEAD
      throw new Error("Service unavailable");
=======
      throw new Error('Backend service unavailable');
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
    }
  },
};

<<<<<<< HEAD
// ✅ Export single instance
=======
// ✅ Export the service
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
export default urlService;
