import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormBuilder } from '@/lib/store';
import { FormBuilderProvider } from '@/lib/store/form-builder-context';
import type { FormConfiguration } from '@/types';
import { Eye, FolderOpen, Hash, Pencil, Plus, Type } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import FieldEditor from './FieldEditor';
import FormPreview from './FormPreview';

const FormBuilderContent: React.FC = () => {
  const { config, addField } = useFormBuilder();

  return (
    <div className="h-auto w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div>
          <h1 className="text-xl font-semibold">Form Builder</h1>
          <p className="text-sm text-muted-foreground">
            Configurable form builder
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0">
        {/* Editor Panel */}
        <Card className="flex flex-col min-h-0">
          <CardHeader className="shrink-0 p-4 pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Field Editor
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="default"
                size="sm"
                className="gap-1.5"
                onClick={() => addField('text')}
              >
                <Plus className="h-3.5 w-3.5" />
                <Type className="h-3.5 w-3.5" />
                Text
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5"
                onClick={() => addField('number')}
              >
                <Plus className="h-3.5 w-3.5" />
                <Hash className="h-3.5 w-3.5" />
                Number
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5"
                onClick={() => addField('group')}
              >
                <Plus className="h-3.5 w-3.5" />
                <FolderOpen className="h-3.5 w-3.5" />
                Group
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <div className="h-full overflow-auto">
              <div className="p-4 space-y-3">
                {config.fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm">No fields yet</p>
                    <p className="text-xs mt-1">
                      Click the buttons above to add fields
                    </p>
                  </div>
                ) : (
                  config.fields.map((field, index) => (
                    <FieldEditor
                      key={field.id}
                      field={field}
                      parentPath={[]}
                      index={index}
                      totalFields={config.fields.length}
                    />
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="flex flex-col min-h-0">
          <CardHeader className="shrink-0 p-4 pb-3 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <div className="h-full overflow-auto">
              <div className="p-4">
                <FormPreview fields={config.fields} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ConfigurableFormBuilder: React.FC = () => {
  const [config, setConfig] = useState<FormConfiguration>({ fields: [] });

  return (
    <FormBuilderProvider config={config} setConfig={setConfig}>
      <FormBuilderContent />
    </FormBuilderProvider>
  );
};

export default ConfigurableFormBuilder;
