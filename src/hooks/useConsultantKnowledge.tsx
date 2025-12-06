import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ConsultantKnowledge, KnowledgeType } from '@/types/audit';
import { toast } from '@/hooks/use-toast';

interface UseConsultantKnowledgeReturn {
  knowledge: ConsultantKnowledge[];
  loading: boolean;
  addKnowledge: (data: Omit<ConsultantKnowledge, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'is_approved' | 'usage_count'>) => Promise<boolean>;
  updateKnowledge: (id: string, data: Partial<ConsultantKnowledge>) => Promise<boolean>;
  deleteKnowledge: (id: string) => Promise<boolean>;
  incrementUsage: (id: string) => Promise<void>;
}

/**
 * Hook für die Beratungs-Wissensdatenbank
 * Ermöglicht das Teilen von Best Practices und Erfahrungen zwischen Beratern
 */
export const useConsultantKnowledge = (controlId?: string): UseConsultantKnowledgeReturn => {
  const { user } = useAuth();
  const [knowledge, setKnowledge] = useState<ConsultantKnowledge[]>([]);
  const [loading, setLoading] = useState(true);

  // Lade Wissen für einen Control
  const loadKnowledge = useCallback(async () => {
    if (!controlId) {
      setKnowledge([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Suche nach exakter Control-ID und nach der Basis-ID (ohne Framework-Prefix)
      const baseControlId = controlId.includes(':') 
        ? controlId.split(':')[1] 
        : controlId;

      const { data, error } = await supabase
        .from('consultant_knowledge')
        .select(`
          *,
          profiles!consultant_knowledge_created_by_fkey (
            full_name
          )
        `)
        .or(`control_id.eq.${controlId},control_id.eq.${baseControlId}`)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      const formattedData: ConsultantKnowledge[] = (data || []).map(item => ({
        ...item,
        creator_name: item.profiles?.full_name || 'Unbekannt'
      }));

      setKnowledge(formattedData);
    } catch (error) {
      console.error('Error loading knowledge:', error);
    } finally {
      setLoading(false);
    }
  }, [controlId]);

  useEffect(() => {
    loadKnowledge();
  }, [loadKnowledge]);

  // Realtime subscription für Wissen
  useEffect(() => {
    if (!controlId) return;

    const baseControlId = controlId.includes(':') 
      ? controlId.split(':')[1] 
      : controlId;

    const channel = supabase
      .channel(`knowledge-${controlId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultant_knowledge',
          filter: `control_id=in.(${controlId},${baseControlId})`
        },
        () => {
          loadKnowledge();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [controlId, loadKnowledge]);

  // Neues Wissen hinzufügen
  const addKnowledge = async (
    data: Omit<ConsultantKnowledge, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'is_approved' | 'usage_count'>
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('consultant_knowledge')
        .insert({
          control_id: data.control_id,
          knowledge_type: data.knowledge_type,
          title: data.title,
          content: data.content,
          source: data.source || '',
          created_by: user.id,
          is_approved: false,
          usage_count: 0
        });

      if (error) throw error;

      toast({
        title: 'Wissen hinzugefügt',
        description: 'Ihr Beitrag wurde zur Wissensdatenbank hinzugefügt.'
      });

      await loadKnowledge();
      return true;
    } catch (error) {
      console.error('Error adding knowledge:', error);
      toast({
        title: 'Fehler',
        description: 'Das Wissen konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Wissen aktualisieren
  const updateKnowledge = async (id: string, data: Partial<ConsultantKnowledge>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('consultant_knowledge')
        .update({
          title: data.title,
          content: data.content,
          source: data.source,
          knowledge_type: data.knowledge_type
        })
        .eq('id', id)
        .eq('created_by', user.id); // Nur eigenes Wissen bearbeiten

      if (error) throw error;

      toast({
        title: 'Aktualisiert',
        description: 'Der Eintrag wurde aktualisiert.'
      });

      await loadKnowledge();
      return true;
    } catch (error) {
      console.error('Error updating knowledge:', error);
      toast({
        title: 'Fehler',
        description: 'Die Aktualisierung ist fehlgeschlagen.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Wissen löschen
  const deleteKnowledge = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('consultant_knowledge')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id); // Nur eigenes Wissen löschen

      if (error) throw error;

      toast({
        title: 'Gelöscht',
        description: 'Der Eintrag wurde entfernt.'
      });

      await loadKnowledge();
      return true;
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      toast({
        title: 'Fehler',
        description: 'Das Löschen ist fehlgeschlagen.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Nutzungszähler erhöhen (für Statistik)
  const incrementUsage = async (id: string): Promise<void> => {
    try {
      const item = knowledge.find(k => k.id === id);
      if (!item) return;

      await supabase
        .from('consultant_knowledge')
        .update({ usage_count: (item.usage_count || 0) + 1 })
        .eq('id', id);
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  return {
    knowledge,
    loading,
    addKnowledge,
    updateKnowledge,
    deleteKnowledge,
    incrementUsage
  };
};

// Hilfsfunktion: Wissenstyp-Labels
export const knowledgeTypeLabels: Record<KnowledgeType, { label: string; emoji: string; color: string }> = {
  typical_weakness: { 
    label: 'Typische Schwachstelle', 
    emoji: '⚠️', 
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
  },
  best_practice: { 
    label: 'Best Practice', 
    emoji: '✅', 
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
  },
  interview_tip: { 
    label: 'Interview-Tipp', 
    emoji: '💬', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
  },
  document_hint: { 
    label: 'Dokumenten-Hinweis', 
    emoji: '📄', 
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' 
  },
  template_reference: { 
    label: 'Template-Referenz', 
    emoji: '📋', 
    color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400' 
  }
};

