import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Professional Photographer",
    image: '/images/person1.webp',
    rating: 5,
    text: "SparkFrameAI has completely transformed my workflow. What used to take hours in Photoshop now takes minutes. The AI understands exactly what I need!"
  },
  {
    name: "Michael Chen",
    role: "E-commerce Manager",
    image: '/images/person2.webp',
    rating: 5,
    text: "We process hundreds of product photos daily. This tool increased our productivity by 300%. The quality is consistently excellent and our customers love the results."
  },
  {
    name: "Emily Rodriguez",
    role: "Social Media Influencer",
    image: '/images/person3.webp',
    rating: 5,
    text: "As a content creator, I need my posts to stand out. SparkFrameAI gives me professional-quality edits instantly. My engagement has never been better!"
  },
  {
    name: "David Park",
    role: "Marketing Director",
    image: '/images/person4.webp',
    rating: 5,
    text: "The ROI on this tool is incredible. We've cut our photo editing costs by 70% while improving quality. It's a game-changer for our marketing campaigns."
  },
  {
    name: "Jessica Williams",
    role: "Wedding Photographer",
    image: '/images/person5.webp',
    rating: 5,
    text: "My clients are amazed by the quick turnaround and stunning results. SparkFrameAI helps me deliver magical memories faster than ever before."
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Loved by Creators Worldwide
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their images with SparkFrameAI
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-gray-800">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-white text-sm sm:text-base font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Join our growing community of satisfied users</p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {['/images/person1.webp', '/images/person2.webp', '/images/person3.webp', '/images/person4.webp', '/images/person5.webp'].map((img, i) => (
                <img 
                  key={i} 
                  src={img}
                  alt={`User ${i + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-black object-cover"
                />
              ))}
            </div>
            <p className="text-white font-semibold">10,000+ Happy Users</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;