import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link2, Copy, QrCode, Calendar } from "lucide-react";
import QRCode from "react-qr-code";
import copy from "copy-to-clipboard";
import api from "../services/api"; // ✅ Correct default import

export default function Home() {
  const [url, setUrl] = useState("");
  const [expiry, setExpiry] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // checking, online, offline

  // ✅ useEffect imported now
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      if (api && typeof api.healthCheck === "function") {
        await api.healthCheck(); // ✅ fixed urlService -> api
        setBackendStatus("online");
      } else {
        setBackendStatus("online");
      }
    } catch (error) {
      setBackendStatus("offline");
      console.warn("Backend health check failed:", error?.message || error);
    }
  };

  const buildFinalShort = (result) => {
    if (!result) return "";
    if (typeof result === "string") {
      return result;
    }
    if (result.shortUrl) {
      return result.shortUrl;
    }
    if (result.shortCode) {
      const origin =
        window.location.origin ||
        "https://url-shortener-backend-k0pv.onrender.com";
      return `${origin.replace(/\/$/, "")}/${result.shortCode}`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setShowQR(false);

    if (!url || !url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setError("Please enter a valid URL (include http:// or https://).");
      return;
    }

    if (expiry) {
      const ts = Date.parse(expiry);
      if (Number.isNaN(ts)) {
        setError("Expiry date is invalid.");
        return;
      }
      if (ts <= Date.now()) {
        setError("Expiry date must be in the future.");
        return;
      }
    }

    setLoading(true);
    try {
      // ✅ fixed shortenUrl usage, no destructured import now
      let result;
      if (api && typeof api.shortenUrl === "function") {
        result = await api.shortenUrl(url, expiry || null);
      } else if (typeof api === "function") {
        result = await api(url, expiry || null);
      } else if (api && typeof api.default === "function") {
        result = await api.default(url, expiry || null);
      } else {
        throw new Error("Shorten function not available on API module");
      }

      const final = buildFinalShort(result);
      if (!final) {
        throw new Error("Unexpected API response");
      }
      setShortUrl(final);
      setUrl("");
      setExpiry("");
      toast.success("URL shortened successfully! ✅");
    } catch (err) {
      console.error(err);
      const message =
        err?.message || "Failed to shorten URL. Please try again!";
      setError(`⚠️ ${message}`);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    if (copy(shortUrl)) {
      toast.success("Copied to clipboard! 📋");
    } else {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setError("");
    setShowQR(false);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center justify-center gap-3">
          <span role="img" aria-label="link">
            🔗
          </span>{" "}
          URL Shortener
          <span
            className={`text-sm rounded-full px-2 py-1 ${
              backendStatus === "online"
                ? "bg-green-100 text-green-700"
                : backendStatus === "offline"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {backendStatus}
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="datetime-local"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              min={getMinDateTime()}
              className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              aria-label="Expiry date (optional)"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {shortUrl && (
          <div className="mt-6 text-left">
            <p className="text-gray-600 mb-1">✅ Your short link:</p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold break-all hover:underline"
              >
                {shortUrl}
              </a>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>

                <button
                  onClick={() => setShowQR((s) => !s)}
                  className="flex items-center gap-2 bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 transition"
                >
                  <QrCode className="h-4 w-4" />
                  <span>QR</span>
                </button>
              </div>
            </div>

            {showQR && (
              <div className="mt-4 text-center">
                <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                  <QRCode value={shortUrl} size={160} />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Scan to open the shortened URL
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Made with <span aria-hidden>❤️</span> by{" "}
        <span className="text-blue-600 font-semibold">Avinash</span>
      </p>
    </div>
  );
}
