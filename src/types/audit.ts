export enum AuditStatus {
  UNCHECKED = 'UNCHECKED',
  OK = 'OK',
  OFI = 'OFI', // Opportunity for Improvement
  MINOR_NC = 'MINOR_NC', // Minor Non-Conformity
  MAJOR_NC = 'MAJOR_NC' // Major Non-Conformity
}

// Priorität für Empfehlungen
export type RecommendationPriority = 'must' | 'should' | 'nice';

export interface IsoControl {
  id: string;
  clause: string;
  title: string;
  isoText: string;
  description: string;
  purpose: string;
  questions: string[];
  correctiveAction?: string;
}

export interface IsoSection {
  id: string;
  title: string;
  controls: IsoControl[];
}

// Erweiterte Finding-Struktur mit Berater-Empfehlungen
export interface AuditFinding {
  status: AuditStatus;
  notes: string;
  evidence: string;
  // Berater-Empfehlungs-Felder
  recommendation?: string;
  isQuickWin?: boolean;
  priority?: RecommendationPriority;
  estimatedEffort?: string;
  responsibleRole?: string;
}

export interface AuditState {
  [controlId: string]: AuditFinding;
}

export interface Audit {
  id: string;
  user_id: string;
  client_name: string;
  frameworks: string[];
  language: string;
  created_at: string;
  updated_at: string;
  // Erweiterte Zeiterfassungsfelder
  total_audit_time_seconds?: number;
  audit_started_at?: string;
  audit_completed_at?: string;
}

// ============================================================================
// AUDIT-PLANUNG
// ============================================================================

export interface AuditLocation {
  name: string;
  address?: string;
}

export interface AuditPlanning {
  id: string;
  audit_id: string;
  scope_description: string;
  locations: AuditLocation[];
  departments: string[];
  systems: string[];
  exclusions: string;
  planned_start_date?: string;
  planned_end_date?: string;
  certification_target_date?: string;
  preparation_notes: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ANSPRECHPARTNER
// ============================================================================

export interface AuditContact {
  id: string;
  audit_id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  responsible_areas: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ZEITERFASSUNG
// ============================================================================

export interface ControlTimeEntry {
  id: string;
  audit_id: string;
  control_id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration_seconds: number;
  created_at: string;
}

export interface ControlTimeStats {
  controlId: string;
  totalSeconds: number;
  sessions: number;
}

// ============================================================================
// BERATUNGS-WISSENSDATENBANK
// ============================================================================

export type KnowledgeType = 
  | 'typical_weakness'    // Typische Schwachstellen
  | 'best_practice'       // Best Practice Beispiele
  | 'interview_tip'       // Interview-Tipps
  | 'document_hint'       // Dokumenten-Hinweise
  | 'template_reference'; // Template-Referenzen

export interface ConsultantKnowledge {
  id: string;
  control_id: string;
  knowledge_type: KnowledgeType;
  title: string;
  content: string;
  source: string;
  created_by: string;
  is_approved: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  creator_name?: string;
}

// ============================================================================
// ZERTIFIZIERUNGSREIFE
// ============================================================================

export interface ReadinessScore {
  totalControls: number;
  assessedControls: number;
  okCount: number;
  ofiCount: number;
  minorNcCount: number;
  majorNcCount: number;
  uncheckedCount: number;
  readinessScore: number;  // 0-100
  hasBlockers: boolean;
}

export interface ReadinessBySection {
  sectionId: string;
  sectionTitle: string;
  score: number;
  status: 'ready' | 'warning' | 'critical';
  controls: {
    id: string;
    clause: string;
    status: AuditStatus;
  }[];
}
