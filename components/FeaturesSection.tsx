import React from 'react';
import StylesIcon from './icons/StylesIcon';
import ClockIcon from './icons/ClockIcon';
import QualityIcon from './icons/QualityIcon';

const features = [
  {
    name: 'Versatile AI Styles',
    description: 'Choose from a curated list of professional styles to instantly change the look and feel of your photo.',
    icon: StylesIcon,
  },
  {
    name: 'Instant Results',
    description: 'Our powerful AI processes your images in seconds, not hours. Get stunning results without the wait.',
    icon: ClockIcon,
  },
  {
    name: 'High-Quality Output',
    description: 'Download your enhanced images in high resolution, perfect for printing, portfolios, or social media.',
    icon: QualityIcon,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center animate-fade-in">
          <h2 className="text-base text-[#ea580c] font-semibold tracking-wide uppercase font-['Poppins']">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl font-['Playfair_Display']">
            Everything You Need to Create Stunning Images
          </p>
          <p className="mt-4 max-w-2xl text-lg text-gray-400 lg:mx-auto font-['Poppins']">
            SparkFrameAI combines cutting-edge technology with a simple interface to give your photos a professional edge.
          </p>
        </div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.name} className="relative group">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-[#ea580c] to-[#f97316] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-white font-['Poppins']">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-400 font-['Poppins']">{feature.description}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
