'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, Clear, Send } from '@mui/icons-material';
import { FormSchema, FormField } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { validateForm, ValidationResult } from '@/utils/validation';

interface FormRendererProps {
  formId: string;
  formVersion?: number;
  initialData?: Record<string, any>;
  onSubmit?: (data: Record<string, any>) => void;
  readOnly?: boolean;
}

export default function FormRenderer({
  formId,
  formVersion,
  initialData,
  onSubmit,
  readOnly = false,
}: FormRendererProps) {
  const { getForm, getFormByVersion, saveDraft, getDraft, deleteDraft, addSubmission } = useFormStore();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const formSchema = formVersion
      ? getFormByVersion(formId, formVersion)
      : getForm(formId);
    
    if (formSchema) {
      setForm(formSchema);
      
      // Initialize form data with defaults or draft or initial data
      const draft = getDraft(formId);
      const data = initialData || draft?.data || {};
      
      const initialFormData: Record<string, any> = {};
      formSchema.fields.forEach((field) => {
        if (data[field.name] !== undefined) {
          initialFormData[field.name] = data[field.name];
        } else if (field.defaultValue !== undefined) {
          initialFormData[field.name] = field.defaultValue;
        } else {
          initialFormData[field.name] = '';
        }
      });
      
      setFormData(initialFormData);
    }
  }, [formId, formVersion, getForm, getFormByVersion, getDraft, initialData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: FormField) => {
    setTouched((prev) => ({ ...prev, [field.name]: true }));
    
    // Validate single field
    if (field.validationRules && field.validationRules.length > 0) {
      const fieldValue = formData[field.name];
      const validation = validateForm(
        { [field.name]: fieldValue },
        [{ name: field.name, validationRules: field.validationRules, label: field.label }]
      );
      
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, ...validation.errors }));
      }
    }
  };

  const handleSaveDraft = () => {
    saveDraft(formId, formData);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleClear = () => {
    const clearedData: Record<string, any> = {};
    form?.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        clearedData[field.name] = field.defaultValue;
      } else {
        clearedData[field.name] = '';
      }
    });
    setFormData(clearedData);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!form) {
      console.error('Form not found');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate all fields
      const validation: ValidationResult = validateForm(
        formData,
        form.fields.map((f) => ({
          name: f.name,
          validationRules: f.validationRules,
          label: f.label,
        }))
      );

      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        // Scroll to first error
        const firstErrorField = Object.keys(validation.errors)[0];
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Submit form
      const submission = {
        id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        formId: form.id,
        formVersion: form.version,
        data: formData,
        submittedAt: new Date().toISOString(),
        status: 'submitted' as const,
      };

      addSubmission(submission);
      deleteDraft(formId);

      if (onSubmit) {
        onSubmit(formData);
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Clear form after successful submission
      setTimeout(() => {
        setSubmitSuccess(false);
        handleClear();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setErrors({ _submit: 'An error occurred while submitting the form. Please try again.' });
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? '';
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const showError = isTouched && error;

    const commonProps = {
      fullWidth: true,
      label: field.label,
      required: field.required,
      error: showError,
      helperText: showError ? error : '',
      disabled: readOnly,
      onBlur: () => handleBlur(field),
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <TextField
            {...commonProps}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={4}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            type="date"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'datetime':
        return (
          <TextField
            {...commonProps}
            type="datetime-local"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'dropdown':
        return (
          <FormControl fullWidth error={showError} required={field.required} disabled={readOnly}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {showError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={showError} required={field.required} disabled={readOnly}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {showError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                onBlur={() => handleBlur(field)}
                disabled={readOnly}
              />
            }
            label={field.label}
          />
        );

      case 'toggle':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                onBlur={() => handleBlur(field)}
                disabled={readOnly}
              />
            }
            label={field.label}
          />
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Form not found</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        minHeight: '100vh',
        py: { xs: 3, sm: 5 },
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: { xs: 3, sm: 4 },
              color: 'white',
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                fontWeight: 700,
                mb: 1,
                color: 'white',
              }}
            >
              {form.name}
            </Typography>
            {form.description && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 0,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {form.description}
              </Typography>
            )}
          </Box>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {submitSuccess && (
              <Alert 
                severity="success" 
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setSubmitSuccess(false)}
              >
                {readOnly ? 'Form data updated successfully!' : 'Form submitted successfully!'}
              </Alert>
            )}

            {errors._submit && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errors._submit}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
            {form.fields.map((field) => (
              <Grid 
                item 
                xs={12} 
                sm={field.columnSpan === 4 ? 12 : field.columnSpan === 3 ? 12 : field.columnSpan === 2 ? 6 : 6}
                md={field.columnSpan === 4 ? 12 : field.columnSpan === 3 ? 9 : field.columnSpan === 2 ? 6 : 3}
                key={field.id}
              >
                {renderField(field)}
              </Grid>
            ))}
            </Grid>

            {!readOnly && (
            <Box 
              sx={{ 
                mt: 4, 
                display: 'flex', 
                gap: { xs: 1.5, sm: 2 }, 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'stretch', sm: 'flex-end' }
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClear}
                disabled={isSubmitting}
                fullWidth={{ xs: true, sm: false }}
                sx={{ 
                  order: { xs: 3, sm: 1 },
                  py: { xs: 1.25, sm: 1 }
                }}
              >
                Clear
              </Button>
              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                fullWidth={{ xs: true, sm: false }}
                sx={{ 
                  order: { xs: 2, sm: 2 },
                  py: { xs: 1.25, sm: 1 }
                }}
              >
                Save Draft
              </Button>
              <Button
                variant="contained"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                onClick={handleSubmit}
                disabled={isSubmitting}
                fullWidth={{ xs: true, sm: false }}
                sx={{ 
                  order: { xs: 1, sm: 3 },
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '1rem', sm: '0.875rem' }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
            )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
