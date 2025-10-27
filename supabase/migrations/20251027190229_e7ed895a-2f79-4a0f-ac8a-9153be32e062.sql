-- Create user_images table to store edited images
CREATE TABLE public.user_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_image_url TEXT NOT NULL,
  edited_image_url TEXT NOT NULL,
  style_used TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

-- Create policies for user_images
CREATE POLICY "Users can view their own images" 
ON public.user_images 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images" 
ON public.user_images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" 
ON public.user_images 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_images_user_id ON public.user_images(user_id);
CREATE INDEX idx_user_images_created_at ON public.user_images(created_at DESC);