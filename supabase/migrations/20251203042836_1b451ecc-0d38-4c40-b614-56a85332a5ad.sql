-- Add ON DELETE CASCADE to all foreign keys referencing audits table
-- This ensures all related data is deleted when an audit is deleted

-- Drop and recreate foreign key for audit_activity_log
ALTER TABLE public.audit_activity_log 
DROP CONSTRAINT IF EXISTS audit_activity_log_audit_id_fkey;

ALTER TABLE public.audit_activity_log
ADD CONSTRAINT audit_activity_log_audit_id_fkey 
FOREIGN KEY (audit_id) REFERENCES public.audits(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for audit_findings
ALTER TABLE public.audit_findings 
DROP CONSTRAINT IF EXISTS audit_findings_audit_id_fkey;

ALTER TABLE public.audit_findings
ADD CONSTRAINT audit_findings_audit_id_fkey 
FOREIGN KEY (audit_id) REFERENCES public.audits(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for audit_members
ALTER TABLE public.audit_members 
DROP CONSTRAINT IF EXISTS audit_members_audit_id_fkey;

ALTER TABLE public.audit_members
ADD CONSTRAINT audit_members_audit_id_fkey 
FOREIGN KEY (audit_id) REFERENCES public.audits(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for audit_team
ALTER TABLE public.audit_team 
DROP CONSTRAINT IF EXISTS audit_team_audit_id_fkey;

ALTER TABLE public.audit_team
ADD CONSTRAINT audit_team_audit_id_fkey 
FOREIGN KEY (audit_id) REFERENCES public.audits(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for evidence_files
ALTER TABLE public.evidence_files 
DROP CONSTRAINT IF EXISTS evidence_files_audit_id_fkey;

ALTER TABLE public.evidence_files
ADD CONSTRAINT evidence_files_audit_id_fkey 
FOREIGN KEY (audit_id) REFERENCES public.audits(id) ON DELETE CASCADE;