import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useFormBuilder } from '@/lib/store';
import type { FormField, GroupField } from '@/types';
import {
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Hash,
  Plus,
  Trash2,
  Type,
} from 'lucide-react';
import type React from 'react';
import { memo, useCallback } from 'react';

interface FieldEditorProps {
  field: FormField;
  parentPath: string[];
  index: number;
  totalFields: number;
}

const FieldEditor: React.FC<FieldEditorProps> = memo(
  ({ field, parentPath, index, totalFields }) => {
    const { updateField, deleteField, moveField, addField } = useFormBuilder();

    const handleLabelChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField(field.id, { label: e.target.value }, parentPath);
      },
      [field.id, parentPath, updateField]
    );

    const handleRequiredChange = useCallback(
      (checked: boolean) => {
        updateField(field.id, { required: checked }, parentPath);
      },
      [field.id, parentPath, updateField]
    );

    const handleMinChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          e.target.value === '' ? undefined : Number(e.target.value);
        updateField(field.id, { min: value }, parentPath);
      },
      [field.id, parentPath, updateField]
    );

    const handleMaxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          e.target.value === '' ? undefined : Number(e.target.value);
        updateField(field.id, { max: value }, parentPath);
      },
      [field.id, parentPath, updateField]
    );

    const handleDelete = useCallback(() => {
      deleteField(field.id, parentPath);
    }, [field.id, parentPath, deleteField]);

    const handleMoveUp = useCallback(() => {
      moveField(field.id, 'up', parentPath);
    }, [field.id, parentPath, moveField]);

    const handleMoveDown = useCallback(() => {
      moveField(field.id, 'down', parentPath);
    }, [field.id, parentPath, moveField]);

    const handleAddChildField = useCallback(
      (type: FormField['type']) => {
        addField(type, [...parentPath, field.id]);
      },
      [field.id, parentPath, addField]
    );

    const getFieldIcon = () => {
      switch (field.type) {
        case 'text':
          return <Type className="h-4 w-4" />;
        case 'number':
          return <Hash className="h-4 w-4" />;
        case 'group':
          return <FolderOpen className="h-4 w-4" />;
      }
    };

    const getFieldTypeLabel = () => {
      switch (field.type) {
        case 'text':
          return 'Text Field';
        case 'number':
          return 'Number Field';
        case 'group':
          return 'Group';
      }
    };

    return (
      <Card
        className={`border ${
          field.type === 'group'
            ? 'border-primary/30 bg-muted/30'
            : 'border-border'
        }`}
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {getFieldIcon()}
              <span>{getFieldTypeLabel()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleMoveUp}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleMoveDown}
                disabled={index === totalFields - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-4">
          <Input
            id={`label-${field.id}`}
            label="Label"
            value={field.label}
            onChange={handleLabelChange}
          />
          <Checkbox
            id={`required-${field.id}`}
            label="Required"
            checked={field.required}
            onCheckedChange={handleRequiredChange}
          />

          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <Input
                  id={`min-${field.id}`}
                  label="Min"
                  type="number"
                  value={field.min ?? ''}
                  onChange={handleMinChange}
                  placeholder="Min"
                />
              </div>
              <div className="col-span-1">
                <Input
                  id={`max-${field.id}`}
                  label="Max"
                  type="number"
                  value={field.max ?? ''}
                  onChange={handleMaxChange}
                  placeholder="Max"
                />
              </div>
            </div>
          )}

          {field.type === 'group' && (
            <div className="space-y-3 mt-3 pl-3 border-l-2 border-primary/20">
              <div className="text-xs font-medium text-muted-foreground">
                Child Fields
              </div>
              {(field as GroupField).children.map((childField, childIndex) => (
                <FieldEditor
                  key={childField.id}
                  field={childField}
                  parentPath={[...parentPath, field.id]}
                  index={childIndex}
                  totalFields={(field as GroupField).children.length}
                />
              ))}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAddChildField('text')}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAddChildField('number')}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Number
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAddChildField('group')}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Group
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

FieldEditor.displayName = 'FieldEditor';

export default FieldEditor;
