-- Assign admin role to the specified email
-- First, we need to find the user ID for the email 'globalreceivegateway@gmail.com'
-- Then insert the admin role for that user

-- This migration will be executed after the user with this email signs up
-- For now, we'll create a helper function that can be called to assign admin role

-- Insert admin role for the specified email (this will work once the user signs up)
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Try to find the user by email in profiles table
  SELECT id INTO admin_user_id 
  FROM public.profiles 
  WHERE email = 'globalreceivegateway@gmail.com'
  LIMIT 1;
  
  -- If user exists, insert admin role (if not already exists)
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;