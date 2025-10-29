import axios from "axios";

// ✅ Base Axios instance
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://url-shortener-backend-k0pv.onrender.com/api", // fallback if env not set
  headers: { "Content-Type": "application/json" },
});

// ✅ Request interceptor (for logging)
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

// ✅ Response interceptor (for logging)
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.status,
      error.message
    );
    return Promise.reject(error);
  }
);

// ✅ API Service Functions
const urlService = {
  // 🔹 Create Short URL
  shortenUrl: async (originalUrl, expiryDate = null) => {
    try {
      const payload = {
        longUrl: originalUrl, // backend expects this
        expiryAt: expiryDate, // optional expiry
      };
      const response = await api.post("/shorten", payload);
      return response.data;
    } catch (error) {
      console.error("❌ shortenUrl error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to shorten URL"
      );
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

  // 🔹 Health Check (for status badge)
  healthCheck: async () => {
    try {
      // ✅ if backend uses Spring Boot actuator or simple /health endpoint
      const response = await api.get("/actuator/health").catch(() =>
        api.get("/health") // fallback
      );
      return response.data;
    } catch (error) {
      throw new Error("Service unavailable");
    }
  },
};

// ✅ Export single instance (default)
export default urlService;
