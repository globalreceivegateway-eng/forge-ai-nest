import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import beforeImage from '@/assets/before-artistic.png';
import afterImage from '@/assets/after-artistic.png';

interface BeforeAfterImage {
  before: string;
  after: string;
  title: string;
  style: string;
}

const examples: BeforeAfterImage[] = [
  {
    before: beforeImage,
    after: afterImage,
    title: "Artistic Transform",
    style: "Applied artistic style"
  }
];

const BeforeAfterSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);


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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
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
            className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden cursor-ew-resize border border-gray-800"
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
                alt="Before" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block bg-red-500/80 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
                alt="After" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block bg-green-500/80 text-white px-4 py-2 rounded-full text-sm font-semibold">
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

          {/* Info */}
          <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-white mb-2">{currentExample.title}</h3>
            <p className="text-gray-400">{currentExample.style}</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;