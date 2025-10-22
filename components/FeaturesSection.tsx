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
    <div className="py-16 sm:py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase animate-fade-in">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl animate-slide-up">
            Everything You Need to Create Stunning Images
          </p>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground lg:mx-auto">
            SparkFrameAI combines cutting-edge technology with a simple interface to give your photos a professional edge.
          </p>
        </div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={feature.name} 
                  className="relative glass-card p-6 rounded-lg hover:shadow-[0_0_30px_hsl(14_100%_57%/0.2)] transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <dt>
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-4 animate-pulse-glow">
                      <IconComponent className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="text-lg leading-6 font-medium text-foreground">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 text-base text-muted-foreground">{feature.description}</dd>
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
