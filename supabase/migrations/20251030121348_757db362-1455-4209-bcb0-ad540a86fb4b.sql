-- Add plan column to profiles table to store user's subscription plan
ALTER TABLE public.profiles ADD COLUMN plan TEXT DEFAULT NULL;

-- Add index for faster lookups
CREATE INDEX idx_profiles_plan ON public.profiles(plan);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.plan IS 'User subscription plan name from Whop (e.g., "Test Trial Pack", "Starter Pack", "Pro Pack")';