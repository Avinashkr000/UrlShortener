import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link as LinkIcon, BarChart3, Layout } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">URL Shortener</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Layout className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Layout className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/analytics')
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;