-- Enable realtime for audit_findings and evidence_files
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_findings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.evidence_files;