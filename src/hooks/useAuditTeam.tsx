import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  user_id: string;
  joined_at: string;
  profile?: {
    full_name: string | null;
    user_id: string;
  };
}

export interface ActivityLogEntry {
  id: string;
  audit_id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
  profile?: {
    full_name: string | null;
  };
}

export interface UserProfile {
  user_id: string;
  full_name: string | null;
}

export const useAuditTeam = (auditId: string | undefined) => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users for team selection
  const fetchAllUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .order('full_name');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    setAllUsers(data || []);
  }, []);

  // Fetch team members for current audit
  const fetchTeamMembers = useCallback(async () => {
    if (!auditId) return;

    const { data, error } = await supabase
      .from('audit_team')
      .select('id, user_id, joined_at')
      .eq('audit_id', auditId)
      .order('joined_at');

    if (error) {
      console.error('Error fetching team members:', error);
      return;
    }

    // Fetch profiles for team members
    const userIds = (data || []).map(d => d.user_id);
    let profilesMap: Record<string, { full_name: string | null; user_id: string }> = {};
    
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);
      
      profilesMap = (profiles || []).reduce((acc, p) => {
        acc[p.user_id] = p;
        return acc;
      }, {} as Record<string, { full_name: string | null; user_id: string }>);
    }

    const members = (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      joined_at: item.joined_at,
      profile: profilesMap[item.user_id] || { full_name: null, user_id: item.user_id }
    }));
    
    setTeamMembers(members);
  }, [auditId]);

  // Fetch activity log for current audit
  const fetchActivityLog = useCallback(async () => {
    if (!auditId) return;

    const { data, error } = await supabase
      .from('audit_activity_log')
      .select('id, audit_id, user_id, event_type, event_data, created_at')
      .eq('audit_id', auditId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching activity log:', error);
      return;
    }

    // Fetch profiles for activity log users
    const userIds = [...new Set((data || []).map(d => d.user_id))];
    let profilesMap: Record<string, { full_name: string | null }> = {};
    
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);
      
      profilesMap = (profiles || []).reduce((acc, p) => {
        acc[p.user_id] = { full_name: p.full_name };
        return acc;
      }, {} as Record<string, { full_name: string | null }>);
    }

    const entries = (data || []).map(item => ({
      id: item.id,
      audit_id: item.audit_id,
      user_id: item.user_id,
      event_type: item.event_type,
      event_data: item.event_data as Record<string, unknown>,
      created_at: item.created_at,
      profile: profilesMap[item.user_id] || { full_name: null }
    }));

    setActivityLog(entries);
  }, [auditId]);

  // Log activity
  const logActivity = useCallback(async (eventType: string, eventData: Record<string, string | number | boolean | null> = {}) => {
    if (!auditId || !user) return;

    const { error } = await supabase
      .from('audit_activity_log')
      .insert([{
        audit_id: auditId,
        user_id: user.id,
        event_type: eventType,
        event_data: eventData
      }]);

    if (error) {
      console.error('Error logging activity:', error);
    }
  }, [auditId, user]);

  // Add team member
  const addTeamMember = useCallback(async (userId: string) => {
    if (!auditId || !user) return;

    const { error } = await supabase
      .from('audit_team')
      .insert({
        audit_id: auditId,
        user_id: userId
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Bereits im Team',
          description: 'Diese Person ist bereits Teil des Teams.',
          variant: 'destructive'
        });
      } else {
        console.error('Error adding team member:', error);
        toast({
          title: 'Fehler',
          description: 'Team-Mitglied konnte nicht hinzugefügt werden.',
          variant: 'destructive'
        });
      }
      return;
    }

    const addedUser = allUsers.find(u => u.user_id === userId);
    await logActivity('auditor_added', { 
      added_user_id: userId,
      added_user_name: addedUser?.full_name || 'Unbekannt'
    });

    toast({
      title: 'Team-Mitglied hinzugefügt',
      description: `${addedUser?.full_name || 'Benutzer'} wurde zum Team hinzugefügt.`
    });

    fetchTeamMembers();
  }, [auditId, user, allUsers, logActivity, fetchTeamMembers]);

  // Remove team member
  const removeTeamMember = useCallback(async (memberId: string, memberName: string) => {
    if (!auditId || !user) return;

    const { error } = await supabase
      .from('audit_team')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Error removing team member:', error);
      toast({
        title: 'Fehler',
        description: 'Team-Mitglied konnte nicht entfernt werden.',
        variant: 'destructive'
      });
      return;
    }

    await logActivity('auditor_removed', { removed_user_name: memberName });

    toast({
      title: 'Team-Mitglied entfernt',
      description: `${memberName} wurde aus dem Team entfernt.`
    });

    fetchTeamMembers();
  }, [auditId, user, logActivity, fetchTeamMembers]);

  // Initial fetch and realtime subscription
  useEffect(() => {
    if (!auditId) return;

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAllUsers(), fetchTeamMembers(), fetchActivityLog()]);
      setLoading(false);
    };

    loadData();

    // Subscribe to realtime updates
    const activityChannel = supabase
      .channel(`audit-activity-${auditId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_activity_log',
          filter: `audit_id=eq.${auditId}`
        },
        () => {
          fetchActivityLog();
        }
      )
      .subscribe();

    const teamChannel = supabase
      .channel(`audit-team-${auditId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_team',
          filter: `audit_id=eq.${auditId}`
        },
        () => {
          fetchTeamMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(teamChannel);
    };
  }, [auditId, fetchAllUsers, fetchTeamMembers, fetchActivityLog]);

  return {
    teamMembers,
    activityLog,
    allUsers,
    loading,
    addTeamMember,
    removeTeamMember,
    logActivity,
    refetchActivity: fetchActivityLog
  };
};
