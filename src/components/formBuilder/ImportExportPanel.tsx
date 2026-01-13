import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import type { FormConfiguration } from '@/types';
import { AlertCircle, Check, Copy, Download, Upload } from 'lucide-react';
import type React from 'react';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface ImportExportPanelProps {
  config: FormConfiguration;
  onImport: (config: FormConfiguration) => void;
}

const ImportExportPanel: React.FC<ImportExportPanelProps> = memo(
  ({ config, onImport }) => {
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [importText, setImportText] = useState('');
    const [importError, setImportError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const exportJson = JSON.stringify(config, null, 2);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(exportJson);
        setCopied(true);
        toast.success('Copied!', {
          description: 'Configuration copied to clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy', {
          description: 'Please select and copy manually',
        });
      }
    }, [exportJson]);

    const handleImport = useCallback(() => {
      setImportError(null);

      if (!importText.trim()) {
        setImportError('Please paste a JSON configuration');
        return;
      }

      try {
        const parsed = JSON.parse(importText);

        // Basic validation
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid configuration format');
        }

        if (!Array.isArray(parsed.fields)) {
          throw new Error('Configuration must have a "fields" array');
        }

        // Validate field structure recursively
        const validateField = (field: unknown, path: string): void => {
          if (!field || typeof field !== 'object') {
            throw new Error(`Invalid field at ${path}`);
          }

          const f = field as Record<string, unknown>;

          if (typeof f.id !== 'string' || !f.id) {
            throw new Error(`Missing or invalid "id" at ${path}`);
          }
          if (!['text', 'number', 'group'].includes(f.type as string)) {
            throw new Error(
              `Invalid "type" at ${path}. Must be text, number, or group`
            );
          }
          if (typeof f.label !== 'string') {
            throw new Error(`Missing or invalid "label" at ${path}`);
          }
          if (typeof f.required !== 'boolean') {
            throw new Error(`Missing or invalid "required" at ${path}`);
          }

          if (f.type === 'group') {
            if (!Array.isArray(f.children)) {
              throw new Error(
                `Group field at ${path} must have a "children" array`
              );
            }
            f.children.forEach((child, i) =>
              validateField(child, `${path}.children[${i}]`)
            );
          }
        };

        parsed.fields.forEach((field: unknown, i: number) =>
          validateField(field, `fields[${i}]`)
        );

        onImport(parsed as FormConfiguration);
        setImportDialogOpen(false);
        setImportText('');
        toast('Imported!', {
          description: 'Form configuration imported successfully',
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Invalid JSON format';
        setImportError(message);
      }
    }, [importText, onImport]);

    const handleImportDialogChange = useCallback((open: boolean) => {
      setImportDialogOpen(open);
      if (!open) {
        setImportText('');
        setImportError(null);
      }
    }, []);

    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setImportDialogOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
        {/* Export Dialog */}
        {exportDialogOpen && (
          <Modal
            open={exportDialogOpen}
            onOpenChange={setExportDialogOpen}
            title="Export Configuration"
            desc="Copy or download the form configuration as JSON"
            actionBtns={[
              <Button key="copy-btn" onClick={handleCopy} className="gap-2">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>,
            ]}
          >
            <div className="space-y-3">
              <Label>JSON Configuration</Label>
              <Textarea
                value={exportJson}
                placeholder='{"fields": [...]}'
                autoFocus
                readOnly
                className="font-mono text-xs h-64 resize-none"
              />
            </div>
          </Modal>
        )}

        {/* Import Dialog */}
        {importDialogOpen && (
          <Modal
            open={importDialogOpen}
            onOpenChange={handleImportDialogChange}
            title="Import Configuration"
            desc="Paste a JSON configuration to reconstruct the form"
            actionBtns={[
              <Button key="import-btn" onClick={handleImport} className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>,
            ]}
          >
            <div className="space-y-3">
              <Label>JSON Configuration</Label>
              <Textarea
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value);
                  setImportError(null);
                }}
                autoFocus
                placeholder='{"fields": [...]}'
                className="font-mono text-xs h-64 resize-none"
              />
              {importError && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {importError}
                </p>
              )}
            </div>
          </Modal>
        )}
      </>
    );
  }
);

ImportExportPanel.displayName = 'ImportExportPanel';

export default ImportExportPanel;
