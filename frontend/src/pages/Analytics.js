import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BarChart3, TrendingUp, Globe, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { urlService } from '../services/api';

const Analytics = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    fetchData();
    checkHealth();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await urlService.getAllUrls();
      setUrls(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
      setUrls([]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await urlService.healthCheck();
      setHealthStatus(health);
    } catch (error) {
      setHealthStatus({ status: 'DOWN' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const getAnalytics = () => {
    const total = urls.length;
    const active = urls.filter(url => !isExpired(url.expiryDate)).length;
    const expired = urls.filter(url => isExpired(url.expiryDate)).length;
    const withExpiry = urls.filter(url => url.expiryDate).length;
    
    return { total, active, expired, withExpiry };
  };

  const analytics = getAnalytics();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">Analytics Dashboard</h1>
        <p className="text-xl text-gray-600 mb-6">
          Insights and statistics for your URL shortening service
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={fetchData}
            className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
          
          <button
            onClick={checkHealth}
            className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Check Health</span>
          </button>
        </div>
      </div>

      {/* Health Status */}
      {healthStatus && (
        <div className="mb-8 animate-slide-up">
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            healthStatus.status === 'UP' ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  healthStatus.status === 'UP' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {healthStatus.status === 'UP' ? (
                    <Globe className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Service Status: {healthStatus.status}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {healthStatus.status === 'UP' 
                      ? 'All systems operational' 
                      : 'Service experiencing issues'
                    }
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                healthStatus.status === 'UP'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {healthStatus.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total URLs</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">URLs created</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active URLs</p>
              <p className="text-3xl font-bold text-green-600">{analytics.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {analytics.total > 0 ? Math.round((analytics.active / analytics.total) * 100) : 0}% of total
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Expired URLs</p>
              <p className="text-3xl font-bold text-red-600">{analytics.expired}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {analytics.total > 0 ? Math.round((analytics.expired / analytics.total) * 100) : 0}% of total
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">With Expiry</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.withExpiry}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {analytics.total > 0 ? Math.round((analytics.withExpiry / analytics.total) * 100) : 0}% have expiry
            </span>
          </div>
        </div>
      </div>

      {/* Recent URLs */}
      <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent URLs</h2>
          <span className="text-sm text-gray-500">{urls.length} total URLs</span>
        </div>
        
        {urls.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">Create some URLs to see analytics data here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {urls.slice(0, 10).map((url, index) => {
              const expired = isExpired(url.expiryDate);
              
              return (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                  expired ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {url.originalUrl}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Short: {url.shortUrl}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Expires</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(url.expiryDate)}
                      </p>
                    </div>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expired
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {expired ? 'Expired' : 'Active'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">Java 17</div>
            <div className="text-sm text-gray-600">Runtime</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">Spring Boot</div>
            <div className="text-sm text-gray-600">Framework</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">MySQL</div>
            <div className="text-sm text-gray-600">Database</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-red-600">Redis</div>
            <div className="text-sm text-gray-600">Cache</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;