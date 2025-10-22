import React from 'react';

const galleryItems = [
  {
    id: 1,
    title: 'Professional Portrait',
    description: 'Crisp, clean, and perfectly lit for a stunning professional headshot.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'Cinematic Photo',
    description: 'Dramatic lighting and color grading for a frame-worthy movie still look.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    title: 'Artistic Style',
    description: 'A creative transformation with painterly effects and vibrant colors.',
    imageUrl: 'https://images.unsplash.com/photo-1581338834614-1904a09a5b85?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    title: 'Magazine Cover',
    description: 'Bold, polished, and ready for the front page with high-fashion editing.',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 5,
    title: 'Studio Lighting',
    description: 'Expertly relit to create depth, dimension, and a professional feel.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 6,
    title: 'Beauty Retouch',
    description: 'Flawless skin and enhanced features for a high-end commercial look.',
    imageUrl: 'https://images.unsplash.com/photo-1604681630513-69474a4e253f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const SampleGallery: React.FC = () => {
  return (
    <section id="gallery" className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center animate-fade-in">
          <h2 className="text-5xl font-extrabold text-white mb-4 font-['Playfair_Display']">
            Inspiration Gallery
          </h2>
          <p className="mt-4 text-lg text-gray-300 font-['Poppins']">
            See what our AI can do. Get inspired for your next creation.
          </p>
        </div>
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <div key={item.id} className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-2 hover:shadow-[#ea580c]/20">
              <img className="h-72 w-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.imageUrl} alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-semibold text-white font-['Poppins']">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-300 font-['Poppins'] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SampleGallery;
