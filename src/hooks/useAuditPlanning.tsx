import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuditPlanning, AuditContact, AuditLocation } from '@/types/audit';
import { toast } from '@/hooks/use-toast';

interface UseAuditPlanningReturn {
  planning: AuditPlanning | null;
  contacts: AuditContact[];
  loading: boolean;
  savePlanning: (data: Partial<AuditPlanning>) => Promise<boolean>;
  addContact: (contact: Omit<AuditContact, 'id' | 'audit_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateContact: (id: string, data: Partial<AuditContact>) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
}

export const useAuditPlanning = (auditId: string | undefined): UseAuditPlanningReturn => {
  const [planning, setPlanning] = useState<AuditPlanning | null>(null);
  const [contacts, setContacts] = useState<AuditContact[]>([]);
  const [loading, setLoading] = useState(true);

  // Lade Planung und Kontakte
  const loadData = useCallback(async () => {
    if (!auditId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Parallel laden
      const [planningResult, contactsResult] = await Promise.all([
        supabase
          .from('audit_planning')
          .select('*')
          .eq('audit_id', auditId)
          .maybeSingle(),
        supabase
          .from('audit_contacts')
          .select('*')
          .eq('audit_id', auditId)
          .order('name')
      ]);

      if (planningResult.error && planningResult.error.code !== 'PGRST116') {
        throw planningResult.error;
      }

      if (contactsResult.error) {
        throw contactsResult.error;
      }

      // Parse JSONB fields
      if (planningResult.data) {
        setPlanning({
          ...planningResult.data,
          locations: planningResult.data.locations as AuditLocation[] || [],
          departments: planningResult.data.departments as string[] || [],
          systems: planningResult.data.systems as string[] || []
        });
      } else {
        setPlanning(null);
      }

      setContacts(contactsResult.data?.map(c => ({
        ...c,
        responsible_areas: c.responsible_areas as string[] || []
      })) || []);
    } catch (error) {
      console.error('Error loading planning:', error);
    } finally {
      setLoading(false);
    }
  }, [auditId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Planung speichern/aktualisieren
  const savePlanning = async (data: Partial<AuditPlanning>): Promise<boolean> => {
    if (!auditId) return false;

    try {
      const planningData = {
        audit_id: auditId,
        scope_description: data.scope_description || '',
        locations: data.locations || [],
        departments: data.departments || [],
        systems: data.systems || [],
        exclusions: data.exclusions || '',
        planned_start_date: data.planned_start_date || null,
        planned_end_date: data.planned_end_date || null,
        certification_target_date: data.certification_target_date || null,
        preparation_notes: data.preparation_notes || ''
      };

      const { error } = await supabase
        .from('audit_planning')
        .upsert(planningData, {
          onConflict: 'audit_id'
        });

      if (error) throw error;

      toast({
        title: 'Gespeichert',
        description: 'Die Audit-Planung wurde aktualisiert.'
      });

      await loadData();
      return true;
    } catch (error) {
      console.error('Error saving planning:', error);
      toast({
        title: 'Fehler',
        description: 'Die Planung konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Kontakt hinzufügen
  const addContact = async (
    contact: Omit<AuditContact, 'id' | 'audit_id' | 'created_at' | 'updated_at'>
  ): Promise<boolean> => {
    if (!auditId) return false;

    try {
      const { error } = await supabase
        .from('audit_contacts')
        .insert({
          audit_id: auditId,
          ...contact
        });

      if (error) throw error;

      toast({
        title: 'Kontakt hinzugefügt',
        description: `${contact.name} wurde zur Kontaktliste hinzugefügt.`
      });

      await loadData();
      return true;
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: 'Fehler',
        description: 'Der Kontakt konnte nicht hinzugefügt werden.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Kontakt aktualisieren
  const updateContact = async (id: string, data: Partial<AuditContact>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('audit_contacts')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      await loadData();
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: 'Fehler',
        description: 'Der Kontakt konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Kontakt löschen
  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('audit_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Gelöscht',
        description: 'Der Kontakt wurde entfernt.'
      });

      await loadData();
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Fehler',
        description: 'Der Kontakt konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    planning,
    contacts,
    loading,
    savePlanning,
    addContact,
    updateContact,
    deleteContact
  };
};

