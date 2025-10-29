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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

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
        return;
      }
    }

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (copy(shortenedUrl)) {
      toast.success('Copied to clipboard! 📋');
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleReset = () => {
    setOriginalUrl('');
    setExpiryDate('');
    setShortenedUrl('');
    setShowQR(false);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute from now
    return now.toISOString().slice(0, 16);
  };

  return (
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
        </form>
      </div>

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

          {/* Shortened URL Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1">Shortened URL:</p>
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-mono text-lg break-all hover:underline flex items-center gap-1"
                >
                  {shortenedUrl}
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>

                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <QrCode className="h-4 w-4" />
                  <span>QR Code</span>
                </button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="text-center animate-fade-in">
              <div className="inline-block p-4 bg-white rounded-lg shadow-lg border">
                <QRCode value={shortenedUrl} size={200} level="M" />
              </div>
              <p className="text-sm text-gray-500 mt-2">Scan to open the shortened URL</p>
            </div>
          )}

          {/* Reset Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Shorten Another URL
            </button>
          </div>
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
      </div>
    </div>
  );
};

export default Home;