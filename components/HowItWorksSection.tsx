import React from 'react';

const steps = [
  {
    number: '1',
    title: 'Choose Package',
    description: 'Select the plan that suits your needs',
  },
  {
    number: '2',
    title: 'Upload Photos',
    description: 'Upload up to 4 photos per session',
  },
  {
    number: '3',
    title: 'Get Results',
    description: 'Receive transformed photos within hours',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-black py-12 sm:py-16 md:py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-['Playfair_Display']">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center relative group">
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-10 sm:top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#ea580c] to-transparent opacity-50"></div>
              )}
              <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#ea580c] to-[#f97316] rounded-full mb-4 sm:mb-6 text-white text-2xl sm:text-3xl font-bold shadow-2xl shadow-[#ea580c]/30 group-hover:scale-110 transition-transform duration-300 font-['Playfair_Display'] animate-scale-in">
                {step.number}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 font-['Poppins']">{step.title}</h3>
              <p className="text-sm sm:text-base text-gray-400 font-['Poppins']">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
