-- Drop the problematic policies first
DROP POLICY IF EXISTS "Members can view shared audits" ON public.audits;
DROP POLICY IF EXISTS "Members can update shared audits" ON public.audits;
DROP POLICY IF EXISTS "Audit owners can manage members" ON public.audit_members;
DROP POLICY IF EXISTS "Members can view findings of shared audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Members can create findings for shared audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Members can update findings of shared audits" ON public.audit_findings;

-- Create security definer function to check if user owns an audit
CREATE OR REPLACE FUNCTION public.is_audit_owner(audit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.audits
    WHERE id = audit_id AND user_id = auth.uid()
  )
$$;

-- Create security definer function to check audit membership
CREATE OR REPLACE FUNCTION public.is_audit_member(audit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.audit_members
    WHERE audit_members.audit_id = $1 AND user_id = auth.uid()
  )
$$;

-- Create security definer function to check if user can edit audit
CREATE OR REPLACE FUNCTION public.can_edit_audit(audit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.audit_members
    WHERE audit_members.audit_id = $1 
    AND user_id = auth.uid() 
    AND role IN ('editor', 'admin')
  )
$$;

-- Recreate audits policies using the functions
CREATE POLICY "Members can view shared audits" ON public.audits
FOR SELECT USING (public.is_audit_member(id));

CREATE POLICY "Members can update shared audits" ON public.audits
FOR UPDATE USING (public.can_edit_audit(id));

-- Recreate audit_members policy using the function
CREATE POLICY "Audit owners can manage members" ON public.audit_members
FOR ALL USING (public.is_audit_owner(audit_id));

-- Recreate audit_findings policies for shared audits
CREATE POLICY "Members can view findings of shared audits" ON public.audit_findings
FOR SELECT USING (public.is_audit_member(audit_id));

CREATE POLICY "Members can create findings for shared audits" ON public.audit_findings
FOR INSERT WITH CHECK (public.can_edit_audit(audit_id));

CREATE POLICY "Members can update findings of shared audits" ON public.audit_findings
FOR UPDATE USING (public.can_edit_audit(audit_id));