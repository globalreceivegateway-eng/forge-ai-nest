import React from 'react';

const PricingSection: React.FC = () => {
  return (
    <div className="bg-gray-900">
      <div className="pt-12 sm:pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-gray-400">
              Choose the plan that's right for you.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
        {/* Placeholder for pricing content */}
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-900"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
              <div className="flex-1 bg-white px-6 py-8 lg:p-12">
                <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Free Plan</h3>
                <p className="mt-6 text-base text-gray-500">
                  Get started and explore our AI image enhancement capabilities for free.
                </p>
              </div>
              <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                <p className="text-lg leading-6 font-medium text-gray-900">Pay as you go</p>
                <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900">
                  <span>$0</span>
                  <span className="ml-3 text-xl font-medium text-gray-500">/ mo</span>
                </div>
                <div className="mt-6">
                  <div className="rounded-md shadow">
                    <a href="#" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900">
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
