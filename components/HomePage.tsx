import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import SampleGallery from './SampleGallery';
import Footer from './Footer';
import SandAnimation from './SandAnimation';

interface HomePageProps {
  onEnterEditor: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnterEditor }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <SandAnimation />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow">
          <HeroSection onGetStarted={onEnterEditor} />
          <FeaturesSection />
          <SampleGallery />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
