<<<<<<< HEAD
// javascript
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link2, Copy, QrCode, Calendar, ExternalLink, Zap } from "lucide-react";
import QRCode from "react-qr-code";
import copy from "copy-to-clipboard";
import { shortenUrl } from "../services/api";

export default function Home() {
  const [url, setUrl] = useState("");
  const [expiry, setExpiry] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
=======
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link2, Copy, QrCode, Calendar, ExternalLink, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import copy from 'copy-to-clipboard';
import urlService from '../services/api';

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
  const [showQR, setShowQR] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // checking, online, offline

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await urlService.healthCheck();
      setBackendStatus('online');
    } catch (error) {
      setBackendStatus('offline');
      console.warn('Backend health check failed:', error.message);
    }
  };

  const buildFinalShort = (result) => {
    // Accept multiple API shapes: string, { shortUrl }, { shortCode }
    if (!result) return "";
    if (typeof result === "string") {
      return result;
    }
    if (result.shortUrl) {
      return result.shortUrl;
    }
    if (result.shortCode) {
      // use same origin if backend returns only code
      const origin = window.location.origin || "https://url-shortener-backend-k0pv.onrender.com";
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

<<<<<<< HEAD
    // Basic client-side URL validation
    try {
      // allow URLs like "http(s)://..." only
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setError("Please enter a valid URL (include http:// or https://).");
      return;
    }

    // Validate expiry if provided
    if (expiry) {
      const ts = Date.parse(expiry);
      if (Number.isNaN(ts)) {
        setError("Expiry date is invalid.");
        return;
      }
      if (ts <= Date.now()) {
        setError("Expiry must be a future date/time.");
=======
    // Enhanced URL validation
    try {
      const url = new URL(originalUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      toast.error('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    // Check if backend is offline
    if (backendStatus === 'offline') {
      toast.warn('Backend service is starting up. Please wait a moment...', {
        autoClose: 5000
      });
      // Retry health check
      await checkBackendHealth();
      if (backendStatus === 'offline') {
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
        return;
      }
    }

<<<<<<< HEAD
    setLoading(true);
    try {
      // call API; accept that shortenUrl may accept (url, expiry) or (url)
      const result = await shortenUrl(url, expiry || null);
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
      const message = err?.message || "Failed to shorten URL. Please try again!";
      setError(`⚠️ ${message}`);
      toast.error(message);
=======
    setIsLoading(true);
    try {
      const result = await urlService.shortenUrl(originalUrl, expiryDate || null);
      setShortenedUrl(result.shortUrl);
      toast.success('URL shortened successfully! 🎉');
    } catch (error) {
      console.error('Shortening error:', error);
      
      // Handle specific error types
      if (error.message.includes('timeout') || error.message.includes('starting up')) {
        toast.error('Server is waking up, please try again in 30 seconds...', {
          autoClose: 7000
        });
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Failed to shorten URL');
      }
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
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
    setUrl("");
    setExpiry("");
    setShortUrl("");
    setError("");
    setShowQR(false);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute from now
    return now.toISOString().slice(0, 16);
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          <span role="img" aria-label="link">🔗</span> URL Shortener
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
=======
    <div className="max-w-4xl mx-auto">
      {/* Backend Status Indicator */}
      {backendStatus !== 'checking' && (
        <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
          backendStatus === 'online' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            {backendStatus === 'online' ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Backend service is online and ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>Backend service is starting up (Render free tier spin-up)</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
          Shorten Your URLs
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform long, complex URLs into short, shareable links with advanced analytics and QR codes.
        </p>
        <div className="text-sm text-gray-500">
          <span className="inline-flex items-center space-x-1">
            <span>Powered by</span>
            <span className="font-semibold text-blue-600">Spring Boot</span>
            <span>&</span>
            <span className="font-semibold text-blue-600">React</span>
          </span>
        </div>
      </div>

      {/* URL Shortener Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 glass-effect animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your long URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must start with http:// or https://
            </p>
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="datetime-local"
                id="expiry"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={getMinDateTime()}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Set when this short URL should expire (optional)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || backendStatus === 'offline'}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Shortening...</span>
              </>
            ) : backendStatus === 'offline' ? (
              <>
                <AlertCircle className="h-5 w-5" />
                <span>Backend Starting...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Shorten URL</span>
              </>
            )}
          </button>
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
        </form>

<<<<<<< HEAD
        {error && <p className="text-red-500 mt-3">{error}</p>}
=======
      {/* Result Section */}
      {shortenedUrl && (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-bounce-in">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">URL Shortened Successfully!</h2>
            <p className="text-gray-600">Your new short URL is ready to use</p>
          </div>
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082

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

<<<<<<< HEAD
            {showQR && (
              <div className="mt-4 text-center">
                <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                  <QRCode value={shortUrl} size={160} />
                </div>
                <p className="text-sm text-gray-500 mt-2">Scan to open the shortened URL</p>
=======
          {/* QR Code */}
          {showQR && (
            <div className="text-center animate-fade-in">
              <div className="inline-block p-4 bg-white rounded-lg shadow-lg border">
                <QRCode value={shortenedUrl} size={200} level="M" />
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
              </div>
            )}
          </div>
<<<<<<< HEAD
        )}
=======
        </div>
      )}

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-scale">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Lightning Fast</h3>
          <p className="text-gray-600">Generate short URLs instantly with our optimized Spring Boot backend</p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-scale">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
            <QrCode className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">QR Codes</h3>
          <p className="text-gray-600">Generate QR codes automatically for easy mobile sharing</p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-scale">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Expiry Dates</h3>
          <p className="text-gray-600">Set custom expiration dates for your links with automatic cleanup</p>
        </div>
      </div>

      {/* Tech Stack Footer */}
      <div className="text-center mt-16 p-6 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Built with Modern Technology</h4>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span className="bg-white px-3 py-1 rounded-full">React 18</span>
          <span className="bg-white px-3 py-1 rounded-full">Spring Boot</span>
          <span className="bg-white px-3 py-1 rounded-full">MySQL</span>
          <span className="bg-white px-3 py-1 rounded-full">Redis</span>
          <span className="bg-white px-3 py-1 rounded-full">Docker</span>
        </div>
>>>>>>> 53d73e7253059885498090ff1bea486dbb940082
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Made with <span aria-hidden>❤️</span> by <span className="text-blue-600 font-semibold">Avinash</span>
      </p>
    </div>
  );
}