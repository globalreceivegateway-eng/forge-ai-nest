import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import SampleGallery from './SampleGallery';
import Footer from './Footer';

interface HomePageProps {
  onEnterEditor: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnterEditor }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <main className="flex-grow">
        <HeroSection onGetStarted={onEnterEditor} />
        <FeaturesSection />
        <SampleGallery />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
