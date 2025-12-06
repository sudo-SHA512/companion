-- Create audit_team table for co-equal auditors
CREATE TABLE public.audit_team (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id uuid NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(audit_id, user_id)
);

-- Enable RLS
ALTER TABLE public.audit_team ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view team members (team collaboration)
CREATE POLICY "Authenticated users can view audit teams"
ON public.audit_team FOR SELECT
TO authenticated
USING (true);

-- Audit owners can manage team
CREATE POLICY "Audit owners can manage team"
ON public.audit_team FOR ALL
TO authenticated
USING (is_audit_owner(audit_id))
WITH CHECK (is_audit_owner(audit_id));

-- Team members can add themselves
CREATE POLICY "Users can join audit teams"
ON public.audit_team FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create audit_activity_log table for timeline
CREATE TABLE public.audit_activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id uuid NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_activity_log ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view activity (team collaboration)
CREATE POLICY "Authenticated users can view audit activity"
ON public.audit_activity_log FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert activity
CREATE POLICY "Authenticated users can log activity"
ON public.audit_activity_log FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_audit_activity_log_audit_id ON public.audit_activity_log(audit_id);
CREATE INDEX idx_audit_activity_log_created_at ON public.audit_activity_log(created_at DESC);
CREATE INDEX idx_audit_team_audit_id ON public.audit_team(audit_id);

-- Enable realtime for activity log
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_team;