import { supabase } from '@/src/integrations/supabase/client';
import { STYLE_PROMPTS } from '../constants';

const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const editImageWithAI = async (
  imageUrl: string,
  style: string,
  customPrompt?: string
): Promise<string> => {
  const prompt = style === 'custom' && customPrompt 
    ? customPrompt 
    : STYLE_PROMPTS[style] || "Enhance this image to look more professional and visually appealing.";

  // Convert blob URL to base64 if needed
  let base64Image = imageUrl;
  if (imageUrl.startsWith('blob:')) {
    base64Image = await convertBlobToBase64(imageUrl);
  }

  const { data, error } = await supabase.functions.invoke('edit-image', {
    body: { imageUrl: base64Image, prompt }
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
