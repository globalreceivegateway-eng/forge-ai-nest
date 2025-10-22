import React from 'react';
import MagicWandIcon from './icons/MagicWandIcon';
import PaletteIcon from './icons/PaletteIcon';
import ClockIcon from './icons/ClockIcon';
import BoxIcon from './icons/BoxIcon';
import ShieldIcon from './icons/ShieldIcon';
import RibbonIcon from './icons/RibbonIcon';

const features = [
  {
    icon: MagicWandIcon,
    title: 'AI-Powered Magic',
    description: 'Advanced algorithms transform your photos into stunning artistic masterpieces',
  },
  {
    icon: PaletteIcon,
    title: 'Multiple Styles',
    description: 'Choose from cartoon, watercolor, 3D renders, and more unique transformations',
  },
  {
    icon: ClockIcon,
    title: 'Fast Delivery',
    description: 'Get your transformed photos delivered digitally within hours',
  },
  {
    icon: BoxIcon,
    title: 'Physical Products',
    description: 'Premium packages include albums, frames, and gift boxes',
  },
  {
    icon: ShieldIcon,
    title: 'Secure & Private',
    description: 'Your photos are protected with enterprise-grade security',
  },
  {
    icon: RibbonIcon,
    title: 'Quality Guaranteed',
    description: 'Professional-grade results backed by our satisfaction guarantee',
  },
];

const WhyChooseSection: React.FC = () => {
  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose SparkFrameAI Studio?</h2>
          <p className="text-gray-400 text-lg">
            Professional results with cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.title}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-[#ea580c] transition-all"
              >
                <IconComponent className="h-12 w-12 text-[#ea580c] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
