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
    <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800 fixed w-full top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center cursor-pointer group">
            <SparklesIcon className="h-8 w-8 text-[#ea580c] group-hover:rotate-12 transition-transform duration-300" />
            <span className="ml-3 text-2xl font-bold text-white tracking-wider font-['Poppins']">
              SparkFrame<span className="text-[#ea580c] group-hover:text-[#f97316] transition-colors">AI</span>
            </span>
          </a>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('packages')}
              className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Packages
            </button>
            <a
              href="/auth"
              className="text-gray-300 hover:text-white transition-all text-sm font-medium font-['Poppins'] relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#ea580c] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Sign In
            </a>
            <button 
              onClick={() => onNavigate?.('editor')}
              className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-2 rounded-md hover:from-[#c2410c] hover:to-[#ea580c] transition-all duration-300 text-sm font-medium font-['Poppins'] transform hover:scale-105 shadow-lg hover:shadow-[#ea580c]/50"
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