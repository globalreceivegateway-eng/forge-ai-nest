import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import SampleGallery from './SampleGallery';
import WhyChooseSection from './WhyChooseSection';
import PricingSection from './PricingSection';
import HowItWorksSection from './HowItWorksSection';
import Footer from './Footer';

interface HomePageProps {
  onEnterEditor: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnterEditor }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans pt-16">
      <Navbar onNavigate={(section) => section === 'editor' && onEnterEditor()} />
      <main className="flex-grow">
        <HeroSection onGetStarted={onEnterEditor} />
        <FeaturesSection />
        <SampleGallery />
        <WhyChooseSection />
        <PricingSection onSelectPackage={onEnterEditor} />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
