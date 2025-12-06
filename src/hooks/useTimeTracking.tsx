import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ControlTimeEntry, ControlTimeStats } from '@/types/audit';

interface UseTimeTrackingReturn {
  isTracking: boolean;
  currentSessionSeconds: number;
  totalTimeForControl: number;
  controlStats: ControlTimeStats[];
  startTracking: () => void;
  stopTracking: () => Promise<void>;
  getTimeForControl: (controlId: string) => number;
}

/**
 * Hook für automatische Zeiterfassung pro Control
 * Startet automatisch beim Betreten eines Controls und stoppt beim Verlassen
 */
export const useTimeTracking = (
  auditId: string | undefined,
  currentControlId: string
): UseTimeTrackingReturn => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [controlStats, setControlStats] = useState<ControlTimeStats[]>([]);
  
  // Ref für den aktuellen Tracking-Eintrag
  const trackingStartRef = useRef<Date | null>(null);
  const currentEntryIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Lade bestehende Zeitdaten für alle Controls
  const loadTimeStats = useCallback(async () => {
    if (!auditId) return;

    try {
      const { data, error } = await supabase
        .from('control_time_tracking')
        .select('control_id, duration_seconds')
        .eq('audit_id', auditId);

      if (error) throw error;

      // Aggregiere Zeit pro Control
      const statsMap = new Map<string, ControlTimeStats>();
      data?.forEach(entry => {
        const existing = statsMap.get(entry.control_id);
        if (existing) {
          existing.totalSeconds += entry.duration_seconds || 0;
          existing.sessions += 1;
        } else {
          statsMap.set(entry.control_id, {
            controlId: entry.control_id,
            totalSeconds: entry.duration_seconds || 0,
            sessions: 1
          });
        }
      });

      setControlStats(Array.from(statsMap.values()));
    } catch (error) {
      console.error('Error loading time stats:', error);
    }
  }, [auditId]);

  useEffect(() => {
    loadTimeStats();
  }, [loadTimeStats]);

  // Starte Tracking
  const startTracking = useCallback(async () => {
    if (!auditId || !user || isTracking) return;

    try {
      const startTime = new Date();
      trackingStartRef.current = startTime;
      setIsTracking(true);
      setCurrentSessionSeconds(0);

      // Erstelle DB-Eintrag
      const { data, error } = await supabase
        .from('control_time_tracking')
        .insert({
          audit_id: auditId,
          control_id: currentControlId,
          user_id: user.id,
          started_at: startTime.toISOString(),
          duration_seconds: 0
        })
        .select('id')
        .single();

      if (error) throw error;
      currentEntryIdRef.current = data.id;

      // Starte lokalen Timer
      intervalRef.current = setInterval(() => {
        if (trackingStartRef.current) {
          const elapsed = Math.floor((Date.now() - trackingStartRef.current.getTime()) / 1000);
          setCurrentSessionSeconds(elapsed);
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting time tracking:', error);
      setIsTracking(false);
    }
  }, [auditId, user, currentControlId, isTracking]);

  // Stoppe Tracking
  const stopTracking = useCallback(async () => {
    if (!isTracking || !trackingStartRef.current || !currentEntryIdRef.current) return;

    // Stoppe lokalen Timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - trackingStartRef.current.getTime()) / 1000);

    try {
      // Update DB-Eintrag mit Endzeit und Dauer
      await supabase
        .from('control_time_tracking')
        .update({
          ended_at: endTime.toISOString(),
          duration_seconds: durationSeconds
        })
        .eq('id', currentEntryIdRef.current);

      // Aktualisiere Stats
      await loadTimeStats();
    } catch (error) {
      console.error('Error stopping time tracking:', error);
    } finally {
      trackingStartRef.current = null;
      currentEntryIdRef.current = null;
      setIsTracking(false);
      setCurrentSessionSeconds(0);
    }
  }, [isTracking, loadTimeStats]);

  // Auto-Start beim Control-Wechsel
  useEffect(() => {
    if (auditId && currentControlId && user) {
      // Stoppe altes Tracking und starte neues
      const switchControl = async () => {
        if (isTracking) {
          await stopTracking();
        }
        // Kurze Verzögerung um sicherzustellen, dass alles gestoppt wurde
        setTimeout(() => {
          startTracking();
        }, 100);
      };

      switchControl();
    }

    // Cleanup beim Unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentControlId]); // Nur bei Control-Wechsel

  // Cleanup beim Tab-Wechsel oder Schließen
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTracking) {
        stopTracking();
      }
    };

    const handleBeforeUnload = () => {
      if (isTracking) {
        stopTracking();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTracking, stopTracking]);

  // Hilfsfunktion: Zeit für spezifischen Control
  const getTimeForControl = useCallback((controlId: string): number => {
    const stats = controlStats.find(s => s.controlId === controlId);
    return stats?.totalSeconds || 0;
  }, [controlStats]);

  // Gesamtzeit für aktuellen Control (gespeichert + aktuelle Session)
  const totalTimeForControl = getTimeForControl(currentControlId) + currentSessionSeconds;

  return {
    isTracking,
    currentSessionSeconds,
    totalTimeForControl,
    controlStats,
    startTracking,
    stopTracking,
    getTimeForControl
  };
};

// Hilfsfunktion: Formatiere Sekunden als HH:MM:SS
export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Hilfsfunktion: Formatiere Sekunden als lesbare Dauer
export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds < 60) {
    return `${totalSeconds} Sek.`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) {
    return `${minutes} Min.`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} Std. ${remainingMinutes} Min.`;
};

