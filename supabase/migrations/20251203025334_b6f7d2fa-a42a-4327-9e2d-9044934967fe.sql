-- Create trigger to insert profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert profiles for existing users who don't have one yet
INSERT INTO public.profiles (user_id, full_name)
SELECT id, raw_user_meta_data ->> 'full_name'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles);