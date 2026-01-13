export type FieldType = 'text' | 'number' | 'group';

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
}

export interface TextField extends BaseField {
  type: 'text';
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
}

export interface GroupField extends BaseField {
  type: 'group';
  children: FormField[];
}

export type FormField = TextField | NumberField | GroupField;

export interface FormConfiguration {
  fields: FormField[];
}

export interface FormValues {
  [fieldId: string]: string | number | FormValues;
}

export interface ValidationErrors {
  [fieldId: string]: string | ValidationErrors;
}
