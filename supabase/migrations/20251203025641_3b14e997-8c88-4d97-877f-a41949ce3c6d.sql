-- Allow all authenticated users to manage audit findings (team collaboration)
DROP POLICY IF EXISTS "Users can create findings for their audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Users can update findings of their audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Users can view findings of their audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Users can delete findings of their audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Members can create findings for shared audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Members can update findings of shared audits" ON public.audit_findings;
DROP POLICY IF EXISTS "Members can view findings of shared audits" ON public.audit_findings;

CREATE POLICY "Authenticated users can view all findings"
ON public.audit_findings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create findings"
ON public.audit_findings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update findings"
ON public.audit_findings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete findings"
ON public.audit_findings FOR DELETE TO authenticated USING (true);