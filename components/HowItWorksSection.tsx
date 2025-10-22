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
    <section className="bg-black py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#ea580c] to-transparent"></div>
              )}
              <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#ea580c] to-[#c2410c] rounded-full mb-6 text-white text-3xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
