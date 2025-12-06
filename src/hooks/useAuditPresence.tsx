import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

export type FieldType = 'notes' | 'evidence' | 'files' | null;

export interface UserPresence {
  id: string;
  email: string;
  full_name: string | null;
  control_id: string | null;
  field: FieldType;
  color: string;
}

// Generate consistent colors for users
const userColors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

const getColorForUser = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return userColors[Math.abs(hash) % userColors.length];
};

export const useAuditPresence = (auditId: string) => {
  const { user } = useAuth();
  const [presences, setPresences] = useState<Map<string, UserPresence>>(new Map());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [myProfile, setMyProfile] = useState<{ full_name: string | null } | null>(null);

  // Fetch current user's profile
  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setMyProfile(data);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Track which control and field the current user is editing
  const updateMyPresence = useCallback((controlId: string | null, field: FieldType = null) => {
    if (!channel || !user) return;

    channel.track({
      id: user.id,
      email: user.email || '',
      full_name: myProfile?.full_name || null,
      control_id: controlId,
      field: field,
      color: getColorForUser(user.id),
      online_at: new Date().toISOString(),
    });
  }, [channel, user, myProfile]);

  useEffect(() => {
    if (!auditId || !user) return;

    const presenceChannel = supabase.channel(`audit-presence-${auditId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const newPresences = new Map<string, UserPresence>();
        
        Object.entries(state).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            const presenceData = value[0] as Record<string, unknown>;
            // Don't show current user's own presence
            if (presenceData.id !== user.id) {
              newPresences.set(key, {
                id: presenceData.id as string,
                email: presenceData.email as string,
                full_name: presenceData.full_name as string | null,
                control_id: presenceData.control_id as string | null,
                field: presenceData.field as FieldType,
                color: presenceData.color as string,
              });
            }
          }
        });
        
        setPresences(newPresences);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences: newP }) => {
        console.log('User joined audit:', key, newP);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left audit:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            id: user.id,
            email: user.email || '',
            full_name: myProfile?.full_name || null,
            control_id: null,
            field: null,
            color: getColorForUser(user.id),
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [auditId, user, myProfile]);

  // Get users editing a specific field of a control
  const getUsersEditingField = useCallback((controlId: string, field: FieldType): UserPresence[] => {
    const editors: UserPresence[] = [];
    presences.forEach((presence) => {
      if (presence.control_id === controlId && presence.field === field) {
        editors.push(presence);
      }
    });
    return editors;
  }, [presences]);

  // Get users viewing a specific control (any field)
  const getUsersViewingControl = useCallback((controlId: string): UserPresence[] => {
    const viewers: UserPresence[] = [];
    presences.forEach((presence) => {
      if (presence.control_id === controlId) {
        viewers.push(presence);
      }
    });
    return viewers;
  }, [presences]);

  // Get all active users in the audit
  const getActiveUsers = useCallback((): UserPresence[] => {
    return Array.from(presences.values());
  }, [presences]);

  return {
    presences,
    updateMyPresence,
    getUsersEditingField,
    getUsersViewingControl,
    getActiveUsers,
  };
};
