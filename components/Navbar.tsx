import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-orange-400" />
            <span className="ml-3 text-2xl font-bold text-white tracking-wider">SparkFrame<span className="text-orange-400">AI</span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;