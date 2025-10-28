import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link2, Copy, QrCode, Calendar, ExternalLink, Zap } from 'lucide-react';
import QRCode from 'react-qr-code';
import copy from 'copy-to-clipboard';
import { urlService } from '../services/api';

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!originalUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await urlService.shortenUrl(originalUrl, expiryDate || null);
      setShortenedUrl(result.shortUrl);
      toast.success('URL shortened successfully! 🎉');
    } catch (error) {
      toast.error(error.message);
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

  return (
    <div className="max-w-4xl mx-auto">
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
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Shortening...</span>
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
              <Link2 className="h-6 w-6 text-green-600" />
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
              <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                <QRCode value={shortenedUrl} size={200} />
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
          <p className="text-gray-600">Generate short URLs instantly with our optimized backend</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-scale">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
            <QrCode className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">QR Codes</h3>
          <p className="text-gray-600">Generate QR codes for easy mobile sharing</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-scale">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Expiry Dates</h3>
          <p className="text-gray-600">Set custom expiration dates for your links</p>
        </div>
      </div>
    </div>
  );
};

export default Home;