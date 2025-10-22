import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <SparklesIcon className="h-8 w-8 text-[#ea580c]" />
            <span className="ml-3 text-2xl font-bold text-white tracking-wider">SparkFrame<span className="text-[#ea580c]">AI</span></span>
          </a>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('packages')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Packages
            </button>
            <button 
              onClick={() => onNavigate?.('editor')}
              className="bg-[#ea580c] text-white px-6 py-2 rounded-md hover:bg-[#c2410c] transition-colors text-sm font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;