-- Allow all authenticated users to view all audits (team collaboration requirement)
DROP POLICY IF EXISTS "Users can view their own audits" ON public.audits;
DROP POLICY IF EXISTS "Members can view shared audits" ON public.audits;

CREATE POLICY "Authenticated users can view all audits"
ON public.audits
FOR SELECT
TO authenticated
USING (true);

-- Update audit_team policy to allow adding any user (not just self)
DROP POLICY IF EXISTS "Users can join audit teams" ON public.audit_team;

CREATE POLICY "Authenticated users can add team members"
ON public.audit_team
FOR INSERT
TO authenticated
WITH CHECK (true);