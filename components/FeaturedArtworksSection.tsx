import React from 'react';

const FeaturedArtworksSection: React.FC = () => {
  const artworks = [
    { id: 1, imageUrl: '/images/artistic-style.png', size: 'large' },
    { id: 2, imageUrl: '/images/professional-portrait.png', size: 'medium' },
    { id: 3, imageUrl: '/images/cinematic-photo.png', size: 'medium' },
    { id: 4, imageUrl: '/images/beauty-retouch.png', size: 'small' },
    { id: 5, imageUrl: '/images/magazine-cover.png', size: 'large' },
    { id: 6, imageUrl: '/images/studio-lighting.png', size: 'medium' },
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'row-span-2';
      case 'medium':
        return 'row-span-1';
      case 'small':
        return 'row-span-1';
      default:
        return 'row-span-1';
    }
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Featured Artworks
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover what's possible with our AI-powered creative tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-4">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={`${getSizeClasses(artwork.size)} group relative overflow-hidden rounded-lg hover-scale cursor-pointer`}
            >
              <img
                src={artwork.imageUrl}
                alt={`Featured artwork ${artwork.id}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 smooth-transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworksSection;
