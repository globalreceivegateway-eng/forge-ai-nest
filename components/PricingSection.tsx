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
    <div className={`relative bg-black rounded-2xl p-8 border-2 ${isPopular ? 'border-[#ea580c] shadow-2xl shadow-[#ea580c]/30' : 'border-gray-800'} transition-all duration-300 transform hover:scale-105`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg font-['Poppins'] flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <div className="mb-6">
          <svg className="w-12 h-12 mx-auto mb-4 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="text-2xl font-bold text-white mb-4 font-['Poppins']">{title}</h3>
        </div>
        <div className="mb-2">
          <span className="text-5xl font-bold text-white font-['Playfair_Display']">{price}</span>
        </div>
        <p className="text-gray-400 text-sm font-['Poppins']">per session</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-[#ea580c] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-300 text-sm font-['Poppins']">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={onSelect}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 font-['Poppins'] transform hover:scale-105 ${
          isPopular 
            ? 'bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white hover:from-[#c2410c] hover:to-[#ea580c] shadow-lg hover:shadow-[#ea580c]/50' 
            : 'bg-transparent text-white border-2 border-gray-700 hover:border-[#ea580c] hover:bg-gray-900'
        }`}
      >
        Get Started
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
