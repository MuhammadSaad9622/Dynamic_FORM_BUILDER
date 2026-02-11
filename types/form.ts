export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'date'
  | 'datetime'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'toggle';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'custom';
  value?: string | number;
  message?: string;
}

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: any;
  validationRules?: ValidationRule[];
  options?: FieldOption[];
  columnSpan: 1 | 2 | 3 | 4;
  section?: string;
  group?: string;
  conditionalRender?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
  };
  dependencies?: {
    field: string;
    action: 'show' | 'hide' | 'enable' | 'disable' | 'updateOptions';
    condition: {
      operator: 'equals' | 'notEquals' | 'contains';
      value: any;
    };
  }[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface FormGroup {
  id: string;
  title: string;
  sectionId?: string;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  version: number;
  fields: FormField[];
  sections?: FormSection[];
  groups?: FormGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formVersion: number;
  data: Record<string, any>;
  submittedAt: string;
  updatedAt?: string;
  status: 'draft' | 'submitted';
}

export interface FormDraft {
  formId: string;
  data: Record<string, any>;
  lastSaved: string;
}
