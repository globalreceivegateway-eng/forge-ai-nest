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
  // Check user credits first
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("You must be logged in to edit images");
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error("Failed to check credits");
  }

  if (!profile || profile.credits < 5) {
    throw new Error("Insufficient credits. You need 5 credits to edit an image. Please upgrade your plan.");
  }

  // Validate and sanitize custom prompt
  let prompt: string;
  if (style === 'custom') {
    const raw = (customPrompt ?? '').trim();
    if (!raw) {
      throw new Error('Please enter a custom prompt or choose a preset style.');
    }
    if (raw.length > 500) {
      throw new Error('Custom prompt must be less than 500 characters.');
    }
    prompt = raw.replace(/\s+/g, ' ');
  } else {
    prompt = STYLE_PROMPTS[style] || 'Enhance this image to look more professional and visually appealing.';
  }

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
    const anyErr: any = error as any;
    const status = anyErr?.status;
    const ctx = anyErr?.context;
    const serverMsg = (typeof ctx === 'string' ? ctx : ctx?.error || ctx?.message) as string | undefined;
    const rawMsg = serverMsg || error.message || 'Failed to edit image';

    // Normalize common AI gateway errors to friendly messages
    if (status === 429 || /429|rate limit/i.test(rawMsg)) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (status === 402 || /402|payment|credits|insufficient|not enough credits/i.test(rawMsg)) {
      throw new Error('AI credits exhausted. Please add credits in Settings > Workspace > Usage.');
    }
    if (status === 503 || /503|overloaded|busy/i.test(rawMsg)) {
      throw new Error('The AI service is currently busy. Please try again in a moment.');
    }

    throw new Error(rawMsg);
  }

  // Handle new response format with success flag
  if (data?.success === false) {
    throw new Error(data.error || "Failed to edit image");
  }

  if (!data?.editedImageUrl) {
    throw new Error("No edited image returned from server");
  }

  // Save the edited image to user's gallery
  try {
    await supabase.from('user_images').insert({
      user_id: user.id,
      original_image_url: imageUrl,
      edited_image_url: data.editedImageUrl,
      style_used: style
    });
  } catch (insertError) {
    console.error("Error saving to gallery:", insertError);
    // Don't throw error here, just log it
  }

  return data.editedImageUrl;
};
