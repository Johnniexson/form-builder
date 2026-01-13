import type { FormConfiguration, FormField } from '@/types';
import type React from 'react';
import { type ReactNode, createContext, useCallback, useMemo } from 'react';
import { generateId } from '../utils';

interface FormBuilderContextType {
  config: FormConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<FormConfiguration>>;
  addField: (type: FormField['type'], parentPath?: string[]) => void;
  updateField: (
    fieldId: string,
    updates: Partial<FormField>,
    parentPath?: string[]
  ) => void;
  deleteField: (fieldId: string, parentPath?: string[]) => void;
  moveField: (
    fieldId: string,
    direction: 'up' | 'down',
    parentPath?: string[]
  ) => void;
}

interface FormBuilderProviderProps {
  children: ReactNode;
  config: FormConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<FormConfiguration>>;
}

export const FormBuilderContext = createContext<FormBuilderContextType | null>(
  null
);

export const FormBuilderProvider: React.FC<FormBuilderProviderProps> = ({
  children,
  config,
  setConfig,
}) => {
  const findFieldsArray = useCallback(
    (fields: FormField[], parentPath: string[]): FormField[] | null => {
      if (parentPath.length === 0) return fields;

      const [currentId, ...restPath] = parentPath;
      const parent = fields.find((f) => f.id === currentId);

      if (!parent || parent.type !== 'group') return null;

      if (restPath.length === 0) return parent.children;
      return findFieldsArray(parent.children, restPath);
    },
    []
  );

  const updateFieldsAtPath = useCallback(
    (
      fields: FormField[],
      parentPath: string[],
      updater: (targetFields: FormField[]) => FormField[]
    ): FormField[] => {
      if (parentPath.length === 0) {
        return updater(fields);
      }

      const [currentId, ...restPath] = parentPath;
      return fields.map((field) => {
        if (field.id === currentId && field.type === 'group') {
          return {
            ...field,
            children: updateFieldsAtPath(field.children, restPath, updater),
          };
        }
        return field;
      });
    },
    []
  );

  const addField = useCallback(
    (type: FormField['type'], parentPath: string[] = []) => {
      let newField: FormField;

      switch (type) {
        case 'group':
          newField = {
            id: generateId(),
            type: 'group',
            label: 'New Group',
            required: false,
            children: [],
          };
          break;
        case 'number':
          newField = {
            id: generateId(),
            type: 'number',
            label: 'New Number Field',
            required: false,
          };
          break;
        default:
          newField = {
            id: generateId(),
            type: 'text',
            label: 'New Text Field',
            required: false,
          };
          break;
      }

      setConfig((prev) => ({
        ...prev,
        fields: updateFieldsAtPath(prev.fields, parentPath, (targetFields) => [
          ...targetFields,
          newField,
        ]),
      }));
    },
    [setConfig, updateFieldsAtPath]
  );

  const updateField = useCallback(
    (
      fieldId: string,
      updates: Partial<FormField>,
      parentPath: string[] = []
    ) => {
      setConfig((prev) => ({
        ...prev,
        fields: updateFieldsAtPath(prev.fields, parentPath, (targetFields) =>
          targetFields.map((field) =>
            field.id === fieldId
              ? ({ ...field, ...updates } as FormField)
              : field
          )
        ),
      }));
    },
    [setConfig, updateFieldsAtPath]
  );

  const deleteField = useCallback(
    (fieldId: string, parentPath: string[] = []) => {
      setConfig((prev) => ({
        ...prev,
        fields: updateFieldsAtPath(prev.fields, parentPath, (targetFields) =>
          targetFields.filter((field) => field.id !== fieldId)
        ),
      }));
    },
    [setConfig, updateFieldsAtPath]
  );

  const moveField = useCallback(
    (fieldId: string, direction: 'up' | 'down', parentPath: string[] = []) => {
      setConfig((prev) => ({
        ...prev,
        fields: updateFieldsAtPath(prev.fields, parentPath, (targetFields) => {
          const index = targetFields.findIndex((f) => f.id === fieldId);
          if (index === -1) return targetFields;

          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= targetFields.length)
            return targetFields;

          const newFields = [...targetFields];
          [newFields[index], newFields[newIndex]] = [
            newFields[newIndex],
            newFields[index],
          ];
          return newFields;
        }),
      }));
    },
    [setConfig, updateFieldsAtPath]
  );

  const value = useMemo(
    () => ({
      config,
      setConfig,
      addField,
      updateField,
      deleteField,
      moveField,
    }),
    [config, setConfig, addField, updateField, deleteField, moveField]
  );

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};
