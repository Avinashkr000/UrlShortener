import axios from "axios";

// ✅ Base Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // e.g. https://url-shortener-backend-k0pv.onrender.com/api
  headers: { "Content-Type": "application/json" },
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
    console.error("❌ API Response Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// ✅ API Service Functions
const urlService = {
  // 🔹 Create Short URL
  shortenUrl: async (originalUrl, expiryDate = null) => {
    try {
      const payload = {
        longUrl: originalUrl, // matches backend @RequestBody field
        expiryAt: expiryDate, // optional expiry date
      };
      const response = await api.post("/shorten", payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to shorten URL");
    }
  },

  // 🔹 Get All URLs (Dashboard)
  getAllUrls: async () => {
    try {
      const response = await api.get("/all");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch URLs");
    }
  },

  // 🔹 Delete URL by short code
  deleteUrl: async (shortCode) => {
    try {
      const response = await api.delete(`/delete/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete URL");
    }
  },

  // 🔹 Get Redirect / Analytics
  getRedirect: async (shortCode) => {
    try {
      const response = await api.get(`/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "URL not found");
    }
  },

  // 🔹 Health Check (optional)
  healthCheck: async () => {
    try {
      const response = await api.get("/actuator/health");
      return response.data;
    } catch (error) {
      throw new Error("Service unavailable");
    }
  },
};

// ✅ Export single instance
export default urlService;
