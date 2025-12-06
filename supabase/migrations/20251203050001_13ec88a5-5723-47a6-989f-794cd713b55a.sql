-- Add email column to profiles for display fallback
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Update existing profiles with email from user_id lookup
-- Since we can't directly query auth.users, we'll need to update via edge function or manually
-- For now, update the known profiles
UPDATE public.profiles 
SET full_name = 'Dennis Yilmaz', email = 'dennis.yilmaz@pcg.io'
WHERE user_id = '3e9e29ed-bec1-49db-91a3-4b56e6ccc4e7';

UPDATE public.profiles 
SET full_name = 'Emre Yildirim', email = 'emre.yildirim@pcg.io'
WHERE user_id = '3880bc82-0949-493c-986b-765ca73b9182';

-- Update the handle_new_user function to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$;