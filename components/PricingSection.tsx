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
    <div className={`relative bg-gray-900 rounded-lg p-8 border-2 ${isPopular ? 'border-[#ea580c]' : 'border-gray-800'} hover:border-[#ea580c] transition-all`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#ea580c] text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <div className="mb-2">
          <span className="text-4xl font-bold text-white">{price}</span>
        </div>
        <p className="text-gray-400 text-sm">per session</p>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-[#ea580c] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={onSelect}
        className={`w-full py-3 rounded-md font-semibold transition-colors ${
          isPopular 
            ? 'bg-[#ea580c] text-white hover:bg-[#c2410c]' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Flexible Pricing Plans</h2>
          <p className="text-gray-400 text-lg">
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
