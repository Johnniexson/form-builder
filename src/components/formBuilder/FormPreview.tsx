import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  FormField,
  FormValues,
  GroupField,
  ValidationErrors,
} from '@/types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type React from 'react';
import { memo, useCallback, useMemo, useState } from 'react';

interface FormPreviewProps {
  fields: FormField[];
}

const FormPreview: React.FC<FormPreviewProps> = memo(({ fields }) => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateFields = useCallback(
    (fieldList: FormField[], currentValues: FormValues): ValidationErrors => {
      const newErrors: ValidationErrors = {};

      for (const field of fieldList) {
        if (field.type === 'group') {
          const groupValues = (currentValues[field.id] as FormValues) || {};
          const groupErrors = validateFields(
            (field as GroupField).children,
            groupValues
          );
          if (Object.keys(groupErrors).length > 0) {
            newErrors[field.id] = groupErrors;
          }
        } else {
          const value = currentValues[field.id];

          if (field.required && (value === undefined || value === '')) {
            newErrors[field.id] = 'This field is required';
          } else if (
            field.type === 'number' &&
            value !== undefined &&
            value !== ''
          ) {
            const numValue = Number(value);
            if (Number.isNaN(numValue)) {
              newErrors[field.id] = 'Please enter a valid number';
            } else if (field.min !== undefined && numValue < field.min) {
              newErrors[field.id] = `Minimum value is ${field.min}`;
            } else if (field.max !== undefined && numValue > field.max) {
              newErrors[field.id] = `Maximum value is ${field.max}`;
            }
          }
        }
      }
      return newErrors;
    },
    []
  );

  const handleValueChange = useCallback(
    (fieldId: string, value: string, parentPath: string[] = []) => {
      if (submitted) setSubmitted(false);
      setValues((prev) => {
        if (parentPath.length === 0) {
          return { ...prev, [fieldId]: value };
        }

        const updateNested = (obj: FormValues, path: string[]): FormValues => {
          const [current, ...rest] = path;
          const currentGroup = (obj[current] as FormValues) || {};

          if (rest.length === 0) {
            return {
              ...obj,
              [current]: { ...currentGroup, [fieldId]: value },
            };
          }

          return {
            ...obj,
            [current]: updateNested(currentGroup, rest),
          };
        };

        return updateNested(prev, parentPath);
      });

      // Clear error when user types
      setErrors((prev) => {
        if (parentPath.length === 0) {
          const { [fieldId]: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    },
    [submitted]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validateFields(fields, values);
      setErrors(validationErrors);
      setSubmitted(true);

      if (Object.keys(validationErrors).length === 0) {
        console.log('Form validated with values:', values);
      }
    },
    [fields, values, validateFields]
  );

  const handleReset = useCallback(() => {
    setValues({});
    setErrors({});
    setSubmitted(false);
  }, []);

  const renderField = useCallback(
    (field: FormField, parentPath: string[] = []): React.ReactNode => {
      const getValue = (): string => {
        let current: FormValues = values;
        for (const pathId of parentPath) {
          current = (current[pathId] as FormValues) || {};
        }
        return (current[field.id] as string) ?? '';
      };

      const getError = (): string | undefined => {
        let current: ValidationErrors = errors;
        for (const pathId of parentPath) {
          current = (current[pathId] as ValidationErrors) || {};
        }
        return current[field.id] as string | undefined;
      };

      if (field.type === 'group') {
        return (
          <Card key={field.id} className="border-primary/20 bg-muted/20">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-medium">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              {(field as GroupField).children.map((child) =>
                renderField(child, [...parentPath, field.id])
              )}
            </CardContent>
          </Card>
        );
      }

      const value = getValue();
      const error = getError();

      return (
        <div key={field.id} className="space-y-1.5">
          <Label
            htmlFor={`preview-${field.id}`}
            className="text-sm"
            required={field.required}
          >
            {field.label}
          </Label>
          <Input
            id={`preview-${field.id}`}
            type={field.type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) =>
              handleValueChange(field.id, e.target.value, parentPath)
            }
            className={`h-9 ${error ? 'border-destructive' : ''}`}
            min={field.type === 'number' ? field.min : undefined}
            max={field.type === 'number' ? field.max : undefined}
          />
          {error && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
        </div>
      );
    },
    [values, errors, handleValueChange]
  );

  const hasNoErrors = useMemo(
    () => submitted && Object.keys(errors).length === 0,
    [submitted, errors]
  );

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <p className="text-sm">No fields added yet</p>
        <p className="text-xs mt-1">
          Add fields in the editor to see the preview
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => renderField(field))}

      <div className="grid grid-cols-2 gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit">Validate Form</Button>
      </div>

      {hasNoErrors && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-md text-sm">
          <CheckCircle2 className="h-4 w-4" />
          Form validated successfully!
        </div>
      )}
    </form>
  );
});

FormPreview.displayName = 'FormPreview';

export default FormPreview;
