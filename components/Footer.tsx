import React from 'react';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import logo from '../src/assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SparkFrameAI" className="h-8 w-auto" />
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-xs">
              Transform your images with AI-powered photo editing. Professional results in seconds.
            </p>
            <div className="flex items-center gap-2 text-pink-500 mb-4">
              <Mail className="w-4 h-4" />
              <span className="text-sm break-all">support@sparkframe.ai</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Youtube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">AI Enhancement</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Style Transfer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Background Remove</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Image Restoration</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Batch Processing</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Case Studies</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Press Kit</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Partners</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">GDPR</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Licenses</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} SparkFrameAI Studio. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
