import React from 'react';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                SparkFrameAI
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Transform your images with AI-powered photo editing. Professional results in seconds.
            </p>
            <div className="flex items-center gap-2 text-pink-500 mb-4">
              <Mail className="w-4 h-4" />
              <span className="text-sm">support@sparkframe.ai</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
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
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SparkFrameAI Studio. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
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
