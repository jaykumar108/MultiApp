import React from 'react';
import { Heart, Github, Twitter, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Task Manager</h3>
                <p className="text-sm text-gray-500">Your Productivity Suite</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>By:</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>Jay Sharma</span>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                Todo Management
              </li>
              <li className="hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                Expense Tracking
              </li>
              <li className="hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                AI Chat Assistant
              </li>

            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect</h4>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:text-white group"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-200 hover:text-white group"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 hover:bg-red-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:text-white group"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200/50 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} Task Manager. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;