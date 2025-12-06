-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create audits table for audit sessions
CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL DEFAULT 'Neuer Kunde',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_findings table for storing control findings
CREATE TABLE public.audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  control_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNCHECKED',
  notes TEXT DEFAULT '',
  evidence TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(audit_id, control_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Audits policies
CREATE POLICY "Users can view their own audits"
ON public.audits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audits"
ON public.audits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audits"
ON public.audits FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audits"
ON public.audits FOR DELETE
USING (auth.uid() = user_id);

-- Audit findings policies
CREATE POLICY "Users can view findings of their audits"
ON public.audit_findings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.audits
    WHERE audits.id = audit_findings.audit_id
    AND audits.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create findings for their audits"
ON public.audit_findings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.audits
    WHERE audits.id = audit_findings.audit_id
    AND audits.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update findings of their audits"
ON public.audit_findings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.audits
    WHERE audits.id = audit_findings.audit_id
    AND audits.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete findings of their audits"
ON public.audit_findings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.audits
    WHERE audits.id = audit_findings.audit_id
    AND audits.user_id = auth.uid()
  )
);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audit_findings_updated_at
  BEFORE UPDATE ON public.audit_findings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();