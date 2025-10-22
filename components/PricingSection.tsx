import React from 'react';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, isPopular, onSelect }) => {
  return (
    <div className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 ${isPopular ? 'border-[#ea580c] shadow-2xl shadow-[#ea580c]/20' : 'border-gray-800'} hover:border-[#ea580c] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-pulse">
          <span className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg font-['Poppins']">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">{title}</h3>
        <div className="mb-2">
          <span className="text-5xl font-bold bg-gradient-to-r from-[#ea580c] to-[#f97316] bg-clip-text text-transparent font-['Playfair_Display']">{price}</span>
        </div>
        <p className="text-gray-400 text-sm font-['Poppins']">per session</p>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-[#ea580c] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-sm font-['Poppins']">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={onSelect}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 font-['Poppins'] transform hover:scale-105 ${
          isPopular 
            ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white hover:from-[#c2410c] hover:to-[#ea580c] shadow-lg hover:shadow-[#ea580c]/50' 
            : 'bg-gray-800 text-white hover:bg-gradient-to-r hover:from-[#ea580c] hover:to-[#f97316]'
        }`}
      >
        Select Package
      </button>
    </div>
  );
};

interface PricingSectionProps {
  onSelectPackage?: (packageName: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPackage }) => {
  const packages = [
    {
      title: 'Basic',
      price: '€9.99',
      features: [
        'AI-powered touch-ups',
        'Color correction',
        'Blemish removal',
        'Up to 4 photos per session',
        'Digital files delivered in 24 hours',
        'High-resolution downloads',
      ],
    },
    {
      title: 'Standard',
      price: '€19.99',
      isPopular: true,
      features: [
        'Everything in Basic',
        'Style transformations',
        'Cartoon style',
        'Watercolor painting style',
        '3D rendered scenes',
        'Multiple style variations',
        'Priority processing',
      ],
    },
    {
      title: 'Premium',
      price: '€39.99',
      features: [
        'Everything in Standard',
        'Physical products included',
        'Premium photo album',
        'Custom frames',
        'Gift box packaging',
        'Express delivery (2-3 hours)',
        'Dedicated support',
        'Free shipping',
      ],
    },
  ];

  return (
    <section id="packages" className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-white mb-4 font-['Playfair_Display']">Flexible Pricing Plans</h2>
          <p className="text-gray-400 text-lg font-['Poppins']">
            Select the package that best fits your needs and start transforming your photos today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <PricingCard
              key={pkg.title}
              title={pkg.title}
              price={pkg.price}
              features={pkg.features}
              isPopular={pkg.isPopular}
              onSelect={() => onSelectPackage?.(pkg.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
