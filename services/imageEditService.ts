import { supabase } from '@/src/integrations/supabase/client';
import { STYLE_PROMPTS } from '../constants';

export const editImageWithAI = async (
  imageUrl: string,
  style: string,
  customPrompt?: string
): Promise<string> => {
  const prompt = style === 'custom' && customPrompt 
    ? customPrompt 
    : STYLE_PROMPTS[style] || "Enhance this image to look more professional and visually appealing.";

  const { data, error } = await supabase.functions.invoke('edit-image', {
    body: { imageUrl, prompt }
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "Failed to edit image");
  }

  if (!data?.editedImageUrl) {
    throw new Error("No edited image returned from server");
  }

  return data.editedImageUrl;
};
