import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center group">
            <SparklesIcon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="ml-3 text-2xl font-bold text-foreground tracking-wider">
              SparkFrame<span className="gradient-text">AI</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;