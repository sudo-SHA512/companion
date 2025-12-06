-- Add frameworks and language columns to audits table
ALTER TABLE public.audits 
ADD COLUMN frameworks text[] NOT NULL DEFAULT ARRAY['iso27001']::text[],
ADD COLUMN language text NOT NULL DEFAULT 'de';