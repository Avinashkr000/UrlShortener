import axios from "axios";

// ✅ Base API Config
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://url-shortener-backend-k0pv.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ API Request Logger
api.interceptors.request.use(
  (config) => {
    console.log("➡️ Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ API Response Logger
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ✅ URL Service
const urlService = {
  // 🔹 Shorten URL
  shortenUrl: async (originalUrl, expiryDate = null) => {
    try {
      const payload = {
        originalUrl: originalUrl, // ✅ backend expects this key
        expiryAt: expiryDate,
      };
      const res = await api.post("/shorten", payload);
      return res.data;
    } catch (err) {
      console.error("❌ shortenUrl:", err);
      throw new Error(err.response?.data?.message || "Failed to shorten URL");
    }
  },

  // 🔹 Get all URLs
  getAllUrls: async () => {
    try {
      const res = await api.get("/all");
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch URLs");
    }
  },

  // 🔹 Delete URL
// 🔹 Delete URL (fixed)
deleteUrl: async (shortCode) => {
  try {
    const res = await api.delete(`/${shortCode}`, { responseType: "text" }); // ✅ tell Axios it's plain text
    console.log("✅ Delete response:", res.data);
    return res.data || "Deleted successfully"; // fallback
  } catch (err) {
    console.error("❌ Delete error:", err);
    throw new Error("Delete failed");
  }
},


  // 🔹 Health Check
  healthCheck: async () => {
    try {
      const res = await api.get("/actuator/health").catch(() => api.get("/health"));
      return res.data;
    } catch (err) {
      throw new Error("Service unavailable");
    }
  },
};

export default urlService;
