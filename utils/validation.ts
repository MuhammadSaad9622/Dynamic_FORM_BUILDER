import { ValidationRule } from '@/types/form';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (
  value: any,
  rules: ValidationRule[] = [],
  fieldName: string
): string | null => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message || `${fieldName} is required`;
        }
        break;
        
      case 'minLength':
        if (value && typeof value === 'string' && value.length < (rule.value as number)) {
          return rule.message || `${fieldName} must be at least ${rule.value} characters`;
        }
        break;
        
      case 'maxLength':
        if (value && typeof value === 'string' && value.length > (rule.value as number)) {
          return rule.message || `${fieldName} must be less than ${rule.value} characters`;
        }
        break;
        
      case 'pattern':
        if (value && typeof value === 'string') {
          const regex = new RegExp(rule.value as string);
          if (!regex.test(value)) {
            return rule.message || `${fieldName} format is invalid`;
          }
        }
        break;
        
      case 'min':
        if (value !== null && value !== undefined && Number(value) < (rule.value as number)) {
          return rule.message || `${fieldName} must be at least ${rule.value}`;
        }
        break;
        
      case 'max':
        if (value !== null && value !== undefined && Number(value) > (rule.value as number)) {
          return rule.message || `${fieldName} must be at most ${rule.value}`;
        }
        break;
    }
  }
  return null;
};

export const validateForm = (
  data: Record<string, any>,
  fields: { name: string; validationRules?: ValidationRule[]; label: string }[]
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  fields.forEach((field) => {
    const value = data[field.name];
    const error = validateField(value, field.validationRules, field.label);
    if (error) {
      errors[field.name] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
