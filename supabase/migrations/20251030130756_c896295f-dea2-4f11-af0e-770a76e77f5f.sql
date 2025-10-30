-- Add whop_user_id column to profiles table to link Whop users without requiring email
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whop_user_id TEXT UNIQUE;