import React from 'react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="relative bg-gray-900">
      <div className="absolute inset-0">
        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1526948128573-703ee1a4563e?q=80&w=2070&auto=format&fit=crop" alt="Abstract background"/>
        <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">Transform Your Photos with</span>
          <span className="block text-orange-400">One-Click AI Magic</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-lg sm:text-xl text-gray-300 sm:max-w-3xl">
          Instantly elevate your images with professional styles, cinematic looks, and artistic flair. 
          Our AI-powered editor does the hard work for you.
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid">
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
