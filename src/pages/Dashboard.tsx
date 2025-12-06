import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LogOut, Loader2, Calendar, Trash2, MoreHorizontal, Globe, Key } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAudit } from '@/hooks/useAudit';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CreateAuditDialog } from '@/components/audit/CreateAuditDialog';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SupportedLanguage } from '@/types/framework';
import { countTotalControls } from '@/data/frameworks';
import { cn } from '@/lib/utils';

const frameworkLabels: Record<string, string> = {
  iso27001: 'ISO 27001',
  tisax: 'TISAX',
  nis2: 'NIS2',
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { allAudits, auditProgress, auditTeams, loading: auditLoading, createNewAudit, deleteAudit } = useAudit();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState<{ id: string; name: string } | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('must_change_password')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profile?.must_change_password) {
        setMustChangePassword(true);
        setPasswordDialogOpen(true);
      }
    };
    checkPasswordStatus();
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  const filteredAudits = useMemo(() => {
    let result = allAudits;
    if (activeFilter) {
      result = result.filter(audit => audit.frameworks.includes(activeFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(audit => 
        audit.client_name.toLowerCase().includes(q) ||
        audit.frameworks.some(f => frameworkLabels[f]?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [allAudits, searchQuery, activeFilter]);

  const getProgress = (auditId: string, frameworks: string[]) => {
    const progress = auditProgress[auditId];
    const total = countTotalControls(frameworks);
    if (!progress || total === 0) return 0;
    return Math.round((progress.completed / total) * 100);
  };

  const handleCreate = async (name: string, lang: SupportedLanguage, frameworks: string[]) => {
    const audit = await createNewAudit(name, lang, frameworks);
    if (audit) navigate(`/audit/${audit.id}`);
  };

  const handleDelete = async () => {
    if (auditToDelete) {
      await deleteAudit(auditToDelete.id);
      setDeleteDialogOpen(false);
      setAuditToDelete(null);
    }
  };

  if (authLoading || auditLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="text-base font-semibold">Audit Companion</h1>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-foreground text-background text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || 'Benutzer'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPasswordDialogOpen(true)}>
                  <Key className="w-4 h-4 mr-2" />
                  Passwort ändern
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { signOut(); navigate('/auth'); }} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Audits</h2>
            <p className="text-muted-foreground text-sm mt-1">{allAudits.length} Projekte</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Neues Audit
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-1">
            {['iso27001', 'tisax', 'nis2'].map(fw => (
              <Button
                key={fw}
                variant={activeFilter === fw ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(activeFilter === fw ? null : fw)}
                className="text-xs"
              >
                {frameworkLabels[fw]}
              </Button>
            ))}
          </div>
        </div>

        {/* Audits List */}
        {filteredAudits.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              {allAudits.length === 0 ? 'Noch keine Audits vorhanden' : 'Keine Ergebnisse'}
            </p>
            {allAudits.length === 0 && (
              <Button onClick={() => setCreateDialogOpen(true)} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Erstes Audit erstellen
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAudits.map((audit) => {
              const progress = getProgress(audit.id, audit.frameworks);
              const creator = auditTeams[audit.id]?.creator;
              
              return (
                <div
                  key={audit.id}
                  onClick={() => navigate(`/audit/${audit.id}`)}
                  className="group flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  {/* Progress Ring */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <svg className="w-10 h-10 -rotate-90">
                      <circle cx="20" cy="20" r="16" className="fill-none stroke-border stroke-[3]" />
                      <circle 
                        cx="20" cy="20" r="16" 
                        className="fill-none stroke-foreground stroke-[3]"
                        strokeDasharray={`${progress * 1.005} 100.5`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
                      {progress}%
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{audit.client_name}</h3>
                      <div className="flex gap-1">
                        {audit.frameworks.map(fw => (
                          <span key={fw} className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">
                            {frameworkLabels[fw]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(audit.updated_at).toLocaleDateString('de-DE')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {audit.language.toUpperCase()}
                      </span>
                      {creator && <span>{creator.full_name || creator.email}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAuditToDelete({ id: audit.id, name: audit.client_name });
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <CreateAuditDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onCreateAudit={handleCreate} />
      
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        isForced={mustChangePassword}
        userId={user.id}
        onSuccess={() => { setMustChangePassword(false); setPasswordDialogOpen(false); }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Audit löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              "{auditToDelete?.name}" wird unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
