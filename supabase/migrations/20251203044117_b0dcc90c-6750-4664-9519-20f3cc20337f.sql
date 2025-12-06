-- Allow all authenticated users to delete team members
CREATE POLICY "Authenticated users can delete team members"
ON public.audit_team
FOR DELETE
TO authenticated
USING (true);