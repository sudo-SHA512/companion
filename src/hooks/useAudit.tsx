import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Audit } from '@/types/audit';
import { SupportedLanguage } from '@/types/framework';
import { toast } from '@/hooks/use-toast';

export interface AuditProgress {
  [auditId: string]: {
    completed: number;
    total: number;
  };
}

export interface AuditCreator {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

export interface AuditTeamMember {
  user_id: string;
  full_name: string | null;
}

export interface AuditWithTeam {
  [auditId: string]: {
    creator: AuditCreator | null;
    team: AuditTeamMember[];
  };
}

export const useAudit = () => {
  const { user } = useAuth();
  const [allAudits, setAllAudits] = useState<Audit[]>([]);
  const [auditProgress, setAuditProgress] = useState<AuditProgress>({});
  const [auditTeams, setAuditTeams] = useState<AuditWithTeam>({});
  const [loading, setLoading] = useState(true);

  // Log activity helper
  const logActivity = async (auditId: string, eventType: string, eventData: Record<string, string | number | boolean | null> = {}) => {
    if (!user) return;
    
    await supabase
      .from('audit_activity_log')
      .insert([{
        audit_id: auditId,
        user_id: user.id,
        event_type: eventType,
        event_data: eventData
      }]);
  };

  // Fetch all audits (collaborative - all users can see all audits)
  const fetchAllAudits = useCallback(async () => {
    if (!user) return [];

    const { data: audits, error } = await supabase
      .from('audits')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching audits:', error);
      return [];
    }

    return (audits || []) as Audit[];
  }, [user]);

  // Fetch progress for all audits
  const fetchAuditProgress = useCallback(async (auditIds: string[]) => {
    if (auditIds.length === 0) return {};

    const { data: findings, error } = await supabase
      .from('audit_findings')
      .select('audit_id, status')
      .in('audit_id', auditIds);

    if (error) {
      console.error('Error fetching findings progress:', error);
      return {};
    }

    const progress: AuditProgress = {};
    auditIds.forEach(id => {
      const auditFindings = findings?.filter(f => f.audit_id === id) || [];
      const completed = auditFindings.filter(f => f.status !== 'UNCHECKED').length;
      progress[id] = { completed, total: auditFindings.length };
    });

    return progress;
  }, []);

  // Fetch creators and team members for all audits
  const fetchAuditTeams = useCallback(async (audits: Audit[]) => {
    if (audits.length === 0) return {};

    const auditIds = audits.map(a => a.id);
    const creatorIds = [...new Set(audits.map(a => a.user_id))];

    // Fetch profiles for creators
    const { data: creatorProfiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, email')
      .in('user_id', creatorIds);

    // Fetch team members
    const { data: teamMembers } = await supabase
      .from('audit_team')
      .select('audit_id, user_id')
      .in('audit_id', auditIds);

    // Get unique team member user IDs
    const teamUserIds = [...new Set(teamMembers?.map(t => t.user_id) || [])];
    
    // Fetch profiles for team members
    let teamProfiles: { user_id: string; full_name: string | null }[] = [];
    if (teamUserIds.length > 0) {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', teamUserIds);
      teamProfiles = data || [];
    }

    // Build the teams map
    const teams: AuditWithTeam = {};
    audits.forEach(audit => {
      const creatorProfile = creatorProfiles?.find(p => p.user_id === audit.user_id);
      const auditTeamMembers = teamMembers?.filter(t => t.audit_id === audit.id) || [];
      const teamWithProfiles = auditTeamMembers.map(tm => {
        const profile = teamProfiles.find(p => p.user_id === tm.user_id);
        return {
          user_id: tm.user_id,
          full_name: profile?.full_name || null
        };
      });

      teams[audit.id] = {
        creator: creatorProfile ? { 
          user_id: creatorProfile.user_id, 
          full_name: creatorProfile.full_name,
          email: creatorProfile.email 
        } : null,
        team: teamWithProfiles
      };
    });

    return teams;
  }, []);

  // Initialize: fetch all audits and their progress
  useEffect(() => {
    const initialize = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const audits = await fetchAllAudits();
        setAllAudits(audits);
        
        // Fetch progress and teams for all audits
        const auditIds = audits.map(a => a.id);
        const [progress, teams] = await Promise.all([
          fetchAuditProgress(auditIds),
          fetchAuditTeams(audits)
        ]);
        setAuditProgress(progress);
        setAuditTeams(teams);
      } catch (error) {
        console.error('Error initializing audits:', error);
        toast({
          title: 'Fehler',
          description: 'Audits konnten nicht geladen werden.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user, fetchAllAudits, fetchAuditProgress, fetchAuditTeams]);

  // Create new audit with client name, language and frameworks
  const createNewAudit = async (clientName: string = 'Neuer Kunde', language: SupportedLanguage = 'de', frameworks: string[] = ['iso27001']) => {
    if (!user) return null;

    const trimmedName = clientName.trim() || 'Neuer Kunde';

    try {
      const { data: newAudit, error } = await supabase
        .from('audits')
        .insert({ 
          user_id: user.id, 
          client_name: trimmedName,
          language,
          frameworks
        })
        .select()
        .single();

      if (error) throw error;
      
      const audit = newAudit as Audit;
      setAllAudits(prev => [audit, ...prev]);
      
      // Log audit creation
      await logActivity(audit.id, 'audit_created', { 
        client_name: audit.client_name,
        frameworks: frameworks.join(',')
      });
      
      toast({
        title: 'Neues Audit erstellt',
        description: `Audit für "${trimmedName}" wurde angelegt.`
      });

      return audit;
    } catch (error) {
      console.error('Error creating audit:', error);
      toast({
        title: 'Fehler',
        description: 'Neues Audit konnte nicht erstellt werden.',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Delete audit
  const deleteAudit = async (auditId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('audits')
        .delete()
        .eq('id', auditId);

      if (error) throw error;

      setAllAudits(prev => prev.filter(a => a.id !== auditId));

      toast({
        title: 'Audit gelöscht',
        description: 'Das Audit wurde erfolgreich gelöscht.'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting audit:', error);
      toast({
        title: 'Fehler',
        description: 'Audit konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    allAudits,
    auditProgress,
    auditTeams,
    loading,
    createNewAudit,
    deleteAudit
  };
};
