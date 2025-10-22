import React from 'react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ea580c]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="absolute inset-0">
        <img className="w-full h-full object-cover opacity-20" src="https://images.unsplash.com/photo-1526948128573-703ee1a4563e?q=80&w=2070&auto=format&fit=crop" alt="Abstract background"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl animate-fade-in font-['Playfair_Display']">
          <span className="block">Transform Your Photos with</span>
          <span className="block mt-2 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#fb923c] bg-clip-text text-transparent animate-scale-in">
            One-Click AI Magic
          </span>
        </h1>
        
        <p className="mt-8 max-w-lg mx-auto text-lg sm:text-xl text-gray-300 sm:max-w-3xl animate-fade-in font-['Poppins']" style={{ animationDelay: '0.2s' }}>
          Instantly elevate your images with professional styles, cinematic looks, and artistic flair. 
          Our AI-powered editor does the hard work for you.
        </p>
        
        <div className="mt-12 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid">
            <button
              onClick={onGetStarted}
              className="group relative flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-full shadow-2xl text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] transition-all duration-300 transform hover:scale-105 hover:shadow-[#ea580c]/50 font-['Poppins']"
            >
              <span className="relative z-10">Get Started for Free</span>
              <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
