import React, { useState, useCallback } from 'react';
import { Upload, File, Image, FileText, Trash2, Download, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface EvidenceFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

interface EvidenceUploadProps {
  auditId: string;
  controlId: string;
  files: EvidenceFile[];
  onFilesChange: () => void;
}

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType: string | null) => {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('pdf')) return FileText;
  return File;
};

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  auditId,
  controlId,
  files,
  onFilesChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${auditId}/${controlId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('audit-evidence')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Save reference to database
    const { error: dbError } = await supabase
      .from('evidence_files')
      .insert({
        audit_id: auditId,
        control_id: controlId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type
      });

    if (dbError) {
      // Cleanup uploaded file if db insert fails
      await supabase.storage.from('audit-evidence').remove([fileName]);
      throw dbError;
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of droppedFiles) {
        await uploadFile(file);
      }
      toast.success(`${droppedFiles.length} Datei(en) hochgeladen`);
      onFilesChange();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fehler beim Hochladen');
    } finally {
      setIsUploading(false);
    }
  }, [auditId, controlId, onFilesChange]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of selectedFiles) {
        await uploadFile(file);
      }
      toast.success(`${selectedFiles.length} Datei(en) hochgeladen`);
      onFilesChange();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fehler beim Hochladen');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (file: EvidenceFile) => {
    try {
      // Delete from storage
      await supabase.storage.from('audit-evidence').remove([file.file_path]);
      
      // Delete from database
      const { error } = await supabase
        .from('evidence_files')
        .delete()
        .eq('id', file.id);

      if (error) throw error;

      toast.success('Datei gelöscht');
      onFilesChange();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const handleDownload = async (file: EvidenceFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('audit-evidence')
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Fehler beim Download');
    }
  };

  const handlePreview = async (file: EvidenceFile) => {
    if (!file.mime_type?.startsWith('image/')) {
      handleDownload(file);
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('audit-evidence')
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Fehler beim Öffnen');
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          isUploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id={`evidence-upload-${controlId}`}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
        <label
          htmlFor={`evidence-upload-${controlId}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className={cn("w-8 h-8", isDragging ? "text-primary" : "text-muted-foreground")} />
          <div className="text-sm">
            <span className="font-medium text-primary">Dateien auswählen</span>
            <span className="text-muted-foreground"> oder per Drag & Drop ablegen</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Bilder, PDFs, Screenshots, Dokumente (max. 10 MB)
          </p>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.mime_type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 border border-border group hover:bg-muted"
              >
                <FileIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handlePreview(file)}
                    className="text-sm font-medium text-card-foreground hover:text-primary truncate block text-left"
                  >
                    {file.file_name}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
