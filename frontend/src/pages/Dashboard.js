import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Trash2, ExternalLink, Copy, Calendar, BarChart3, RefreshCw } from 'lucide-react';
import copy from 'copy-to-clipboard';
import { urlService } from '../services/api';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
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

  const handleDelete = async (shortCode) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [shortCode]: true }));
    try {
      await urlService.deleteUrl(shortCode);
      setUrls(urls.filter(url => !url.shortUrl.includes(shortCode)));
      toast.success('URL deleted successfully! 🗑️');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [shortCode]: false }));
    }
  };

  const handleCopy = (url) => {
    if (copy(url)) {
      toast.success('Copied to clipboard! 📋');
    } else {
      toast.error('Failed to copy');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
          <BarChart3 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">URL Dashboard</h1>
        <p className="text-xl text-gray-600 mb-6">
          Manage all your shortened URLs in one place
        </p>
        
        <button
          onClick={fetchUrls}
          className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total URLs</p>
              <p className="text-2xl font-bold text-gray-800">{urls.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active URLs</p>
              <p className="text-2xl font-bold text-green-600">
                {urls.filter(url => !isExpired(url.expiryDate)).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Expired URLs</p>
              <p className="text-2xl font-bold text-red-600">
                {urls.filter(url => isExpired(url.expiryDate)).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* URLs Table */}
      {urls.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No URLs Found</h3>
          <p className="text-gray-600 mb-6">Start by creating your first shortened URL!</p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span>Create URL</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {urls.map((url, index) => {
                  const shortCode = url.shortUrl.split('/').pop();
                  const expired = isExpired(url.expiryDate);
                  
                  return (
                    <tr key={index} className={`hover:bg-gray-50 transition-colors ${
                      expired ? 'bg-red-50' : ''
                    }`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 max-w-xs truncate"
                          >
                            <span className="truncate">{url.originalUrl}</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {url.shortUrl}
                          </code>
                          <button
                            onClick={() => handleCopy(url.shortUrl)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(url.expiryDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          expired
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {expired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(shortCode)}
                          disabled={deleteLoading[shortCode]}
                          className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          title="Delete URL"
                        >
                          {deleteLoading[shortCode] ? (
                            <div className="loading-spinner"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="text-sm">Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;