import React, { useEffect, useRef } from 'react';

const SandAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create sand particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'sand-particle';
      
      // Random horizontal position
      const startX = Math.random() * window.innerWidth;
      particle.style.left = `${startX}px`;
      
      // Random animation duration (slower fall)
      const duration = 8 + Math.random() * 12; // 8-20 seconds
      particle.style.animationDuration = `${duration}s`;
      
      // Random delay
      const delay = Math.random() * 5;
      particle.style.animationDelay = `${delay}s`;
      
      // Random size
      const size = 2 + Math.random() * 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random opacity
      particle.style.opacity = String(0.2 + Math.random() * 0.4);
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, (duration + delay) * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 30; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    // Continuously create new particles
    const interval = setInterval(() => {
      createParticle();
    }, 600);

    return () => {
      clearInterval(interval);
      container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
};

export default SandAnimation;
