-- Create storage bucket for audit evidence files
INSERT INTO storage.buckets (id, name, public) VALUES ('audit-evidence', 'audit-evidence', false);

-- Create table for tracking uploaded evidence files
CREATE TABLE public.evidence_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  control_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evidence_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for evidence_files
CREATE POLICY "Users can view evidence files of their audits"
ON public.evidence_files
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.audits
  WHERE audits.id = evidence_files.audit_id AND audits.user_id = auth.uid()
));

CREATE POLICY "Users can insert evidence files for their audits"
ON public.evidence_files
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.audits
  WHERE audits.id = evidence_files.audit_id AND audits.user_id = auth.uid()
));

CREATE POLICY "Users can delete evidence files of their audits"
ON public.evidence_files
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.audits
  WHERE audits.id = evidence_files.audit_id AND audits.user_id = auth.uid()
));

-- Members can view evidence of shared audits
CREATE POLICY "Members can view evidence files of shared audits"
ON public.evidence_files
FOR SELECT
USING (is_audit_member(audit_id));

-- Members can insert evidence for shared audits they can edit
CREATE POLICY "Members can insert evidence files for shared audits"
ON public.evidence_files
FOR INSERT
WITH CHECK (can_edit_audit(audit_id));

-- Storage policies for audit-evidence bucket
CREATE POLICY "Users can upload evidence to their audits"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'audit-evidence' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view evidence from their audits"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'audit-evidence'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete evidence from their audits"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'audit-evidence'
  AND auth.uid() IS NOT NULL
);