import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import beforeLandscape from '@/assets/before-landscape.jpg';
import afterLandscape from '@/assets/after-landscape.jpg';
import beforeArtistic from '@/assets/before-artistic.jpg';
import afterArtistic from '@/assets/after-artistic.jpg';
import beforePortrait from '@/assets/before-portrait.jpg';
import afterPortrait from '@/assets/after-portrait.jpg';

interface BeforeAfterImage {
  before: string;
  after: string;
  title: string;
  style: string;
}

const examples: BeforeAfterImage[] = [
  {
    before: beforeLandscape,
    after: afterLandscape,
    title: "Professional Enhancement",
    style: "Enhanced lighting and colors"
  },
  {
    before: beforeArtistic,
    after: afterArtistic,
    title: "Artistic Transform",
    style: "Applied artistic style"
  },
  {
    before: beforePortrait,
    after: afterPortrait,
    title: "Portrait Perfection",
    style: "Beauty enhancement"
  }
];

const BeforeAfterSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const nextExample = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
    setSliderPosition(50);
  };

  const prevExample = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
    setSliderPosition(50);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const currentExample = examples[currentIndex];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            See the Magic in Action
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Drag the slider to compare before and after transformations
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="relative">
          <div 
            className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden cursor-ew-resize border border-slate-800 shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Before Image */}
            <div className="absolute inset-0">
              <img 
                src={currentExample.before} 
                alt="Before transformation" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  BEFORE
                </span>
              </div>
            </div>

            {/* After Image (clipped) */}
            <div 
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img 
                src={currentExample.after} 
                alt="After transformation" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  AFTER
                </span>
              </div>
            </div>

            {/* Slider Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-gray-900 -ml-1" />
                <ChevronRight className="w-5 h-5 text-gray-900 -mr-1" />
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevExample}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextExample}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Info */}
          <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-white mb-2">{currentExample.title}</h3>
            <p className="text-gray-400">{currentExample.style}</p>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setSliderPosition(50);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-pink-500 w-8' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;