-- ============================================================================
-- AUDIT COMPANION - Erweiterte Features Migration
-- Features: Zertifizierungsreife, Empfehlungen, Wissensdatenbank, Planung, Zeit
-- ============================================================================

-- 1. ERWEITERTE AUDIT_FINDINGS für Berater-Empfehlungen
-- ============================================================================
ALTER TABLE audit_findings 
ADD COLUMN IF NOT EXISTS recommendation TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS is_quick_win BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'should' CHECK (priority IN ('must', 'should', 'nice')),
ADD COLUMN IF NOT EXISTS estimated_effort VARCHAR(50) DEFAULT '',
ADD COLUMN IF NOT EXISTS responsible_role VARCHAR(100) DEFAULT '';

-- 2. AUDIT PLANUNG - Scope, Zeitplan, Ansprechpartner
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_planning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    
    -- Scope Definition
    scope_description TEXT DEFAULT '',
    locations JSONB DEFAULT '[]'::jsonb,  -- [{name: "Hauptsitz", address: "..."}]
    departments JSONB DEFAULT '[]'::jsonb, -- ["IT", "HR", "Finance"]
    systems JSONB DEFAULT '[]'::jsonb,     -- ["SAP", "Active Directory", ...]
    exclusions TEXT DEFAULT '',            -- Ausgeschlossene Bereiche
    
    -- Zeitplanung
    planned_start_date DATE,
    planned_end_date DATE,
    certification_target_date DATE,        -- Ziel: Zertifizierungsaudit
    
    -- Allgemeine Notizen
    preparation_notes TEXT DEFAULT '',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(audit_id)
);

-- 3. ANSPRECHPARTNER pro Audit/Bereich
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT '',          -- z.B. "ISB", "IT-Leitung", "GF"
    department VARCHAR(255) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    responsible_areas JSONB DEFAULT '[]'::jsonb, -- ["Klausel 7", "Annex A.5-A.8"]
    notes TEXT DEFAULT '',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ZEITERFASSUNG pro Control
-- ============================================================================
CREATE TABLE IF NOT EXISTS control_time_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    control_id VARCHAR(50) NOT NULL,       -- z.B. "iso27001:A.5.1"
    user_id UUID NOT NULL,
    
    -- Zeiterfassung
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,    -- Berechnete Dauer
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(audit_id, control_id, user_id, started_at)
);

-- 5. BERATUNGS-WISSENSDATENBANK (Globale Best Practices)
-- ============================================================================
CREATE TABLE IF NOT EXISTS consultant_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id VARCHAR(50) NOT NULL,       -- z.B. "iso27001:A.5.1" oder "A.5.1" für alle Frameworks
    
    -- Wissenstyp
    knowledge_type VARCHAR(30) NOT NULL CHECK (knowledge_type IN (
        'typical_weakness',    -- Typische Schwachstellen
        'best_practice',       -- Best Practice Beispiele
        'interview_tip',       -- Interview-Tipps
        'document_hint',       -- Dokumenten-Hinweise
        'template_reference'   -- Template-Referenzen
    )),
    
    -- Inhalt
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(255) DEFAULT '',        -- z.B. "Kunde ABC GmbH" oder "Erfahrung"
    
    -- Metadaten
    created_by UUID NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,     -- Qualitätssicherung
    usage_count INTEGER DEFAULT 0,         -- Wie oft wurde es angesehen?
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. GESAMT-AUDIT-ZEITERFASSUNG
-- ============================================================================
ALTER TABLE audits
ADD COLUMN IF NOT EXISTS total_audit_time_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS audit_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS audit_completed_at TIMESTAMP WITH TIME ZONE;

-- ============================================================================
-- INDEXES für Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_audit_planning_audit_id ON audit_planning(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_contacts_audit_id ON audit_contacts(audit_id);
CREATE INDEX IF NOT EXISTS idx_control_time_tracking_audit_control ON control_time_tracking(audit_id, control_id);
CREATE INDEX IF NOT EXISTS idx_consultant_knowledge_control ON consultant_knowledge(control_id);
CREATE INDEX IF NOT EXISTS idx_consultant_knowledge_type ON consultant_knowledge(knowledge_type);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Audit Planning - Jeder eingeloggte User kann sehen/bearbeiten
ALTER TABLE audit_planning ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all audit planning" ON audit_planning FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert audit planning" ON audit_planning FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update audit planning" ON audit_planning FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete audit planning" ON audit_planning FOR DELETE TO authenticated USING (true);

-- Audit Contacts
ALTER TABLE audit_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all audit contacts" ON audit_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert audit contacts" ON audit_contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update audit contacts" ON audit_contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete audit contacts" ON audit_contacts FOR DELETE TO authenticated USING (true);

-- Control Time Tracking
ALTER TABLE control_time_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all time tracking" ON control_time_tracking FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert time tracking" ON control_time_tracking FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own time tracking" ON control_time_tracking FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Consultant Knowledge (Globale Wissensdatenbank)
ALTER TABLE consultant_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all knowledge" ON consultant_knowledge FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert knowledge" ON consultant_knowledge FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own knowledge" ON consultant_knowledge FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own knowledge" ON consultant_knowledge FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ============================================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_audit_planning_updated_at ON audit_planning;
CREATE TRIGGER update_audit_planning_updated_at
    BEFORE UPDATE ON audit_planning
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audit_contacts_updated_at ON audit_contacts;
CREATE TRIGGER update_audit_contacts_updated_at
    BEFORE UPDATE ON audit_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultant_knowledge_updated_at ON consultant_knowledge;
CREATE TRIGGER update_consultant_knowledge_updated_at
    BEFORE UPDATE ON consultant_knowledge
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTION: Berechne Zertifizierungsreife-Score
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_readiness_score(p_audit_id UUID)
RETURNS TABLE (
    total_controls INTEGER,
    assessed_controls INTEGER,
    ok_count INTEGER,
    ofi_count INTEGER,
    minor_nc_count INTEGER,
    major_nc_count INTEGER,
    unchecked_count INTEGER,
    readiness_score INTEGER,
    has_blockers BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH findings_summary AS (
        SELECT 
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status != 'UNCHECKED') AS assessed,
            COUNT(*) FILTER (WHERE status = 'OK') AS ok,
            COUNT(*) FILTER (WHERE status = 'OFI') AS ofi,
            COUNT(*) FILTER (WHERE status = 'MINOR_NC') AS minor,
            COUNT(*) FILTER (WHERE status = 'MAJOR_NC') AS major,
            COUNT(*) FILTER (WHERE status = 'UNCHECKED') AS unchecked
        FROM audit_findings
        WHERE audit_id = p_audit_id
    )
    SELECT 
        total::INTEGER,
        assessed::INTEGER,
        ok::INTEGER,
        ofi::INTEGER,
        minor::INTEGER,
        major::INTEGER,
        unchecked::INTEGER,
        -- Score-Berechnung: OK=100%, OFI=80%, MinorNC=50%, MajorNC=0%, Unchecked=0%
        CASE 
            WHEN total = 0 THEN 0
            ELSE ROUND(
                ((ok * 100.0) + (ofi * 80.0) + (minor * 50.0)) / total
            )::INTEGER
        END AS score,
        -- Blocker = Major NCs vorhanden
        (major > 0) AS blockers
    FROM findings_summary;
END;
$$ LANGUAGE plpgsql;

