export const STYLE_PROMPTS: { [key: string]: string } = {
  professional: 'Enhance this portrait to look sharp, professional, and well-lit, suitable for a corporate profile or LinkedIn.',
  cinematic: 'Transform this photo with dramatic lighting and color grading to give it a cinematic, movie-still feel. Add depth and mood.',
  artistic: 'Apply a creative, artistic style to this image. Think painterly effects, vibrant and unconventional colors, and expressive textures.',
  'magazine-cover': 'Edit this photo to be bold, polished, and high-fashion, as if it were for a magazine cover. Focus on clean lines and vibrant colors.',
  'studio-lighting': 'Relight this image to simulate professional studio lighting. Create depth, dimension, and focus on the subject with balanced highlights and shadows.',
  'beauty-retouch': 'Perform a high-end beauty retouch. Smooth skin naturally, enhance facial features like eyes and lips, and create a flawless, commercial look.',
};

export const STYLE_OPTIONS = [
  { id: 'professional', name: 'Professional' },
  { id: 'cinematic', name: 'Cinematic' },
  { id: 'artistic', name: 'Artistic' },
  { id: 'magazine-cover', name: 'Magazine Cover' },
  { id: 'studio-lighting', name: 'Studio Lighting' },
  { id: 'beauty-retouch', name: 'Beauty Retouch' },
  { id: 'custom', name: 'Custom Styling' },
];
