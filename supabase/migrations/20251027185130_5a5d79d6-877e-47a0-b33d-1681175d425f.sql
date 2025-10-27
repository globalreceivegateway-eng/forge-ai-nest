-- Add credits column to profiles table
ALTER TABLE public.profiles
ADD COLUMN credits INTEGER NOT NULL DEFAULT 10;

-- Update the handle_new_user function to set initial credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, full_name, avatar_url, credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    10
  );
  return new;
end;
$function$;

-- Create function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(user_id uuid, amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  current_credits integer;
begin
  -- Get current credits
  SELECT credits INTO current_credits
  FROM public.profiles
  WHERE id = user_id;
  
  -- Check if user has enough credits
  IF current_credits >= amount THEN
    -- Deduct credits
    UPDATE public.profiles
    SET credits = credits - amount
    WHERE id = user_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
end;
$function$;

-- Create RLS policy for credits column
CREATE POLICY "Users can view their own credits"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);