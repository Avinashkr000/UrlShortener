import React from 'react';
import { Github, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side - Brand */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold gradient-text mb-2">URL Shortener</h3>
            <p className="text-gray-600 text-sm">
              A modern, fast, and reliable URL shortening service
            </p>
          </div>

          {/* Right side - Contact */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-2">
              <a
                href="https://github.com/Avinashkr000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:ak749299.ak@gmail.com"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/Avinashkr000/UrlShortener"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Portfolio"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Developed by <span className="font-medium text-blue-600">Avinash Kumar</span>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © 2025 URL Shortener. Built with React, Spring Boot, and ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;