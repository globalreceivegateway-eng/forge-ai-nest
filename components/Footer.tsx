import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SparkFrameAI Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
