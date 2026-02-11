'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { FormField, FieldType, ValidationRule, FieldOption } from '@/types/form';

interface FieldEditorProps {
  field: FormField | null;
  open: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  onDelete?: () => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date & Time' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Group' },
  { value: 'toggle', label: 'Toggle (Switch)' },
];

const VALIDATION_TYPES: { value: ValidationRule['type']; label: string }[] = [
  { value: 'required', label: 'Required' },
  { value: 'minLength', label: 'Min Length' },
  { value: 'maxLength', label: 'Max Length' },
  { value: 'pattern', label: 'Pattern (Regex)' },
  { value: 'min', label: 'Min Value' },
  { value: 'max', label: 'Max Value' },
];

export default function FieldEditor({ field, open, onClose, onSave, onDelete }: FieldEditorProps) {
  const [formData, setFormData] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    name: '',
    placeholder: '',
    required: false,
    columnSpan: 1,
    validationRules: [],
    options: [],
  });

  useEffect(() => {
    if (field) {
      setFormData(field);
    } else {
      setFormData({
        type: 'text',
        label: '',
        name: '',
        placeholder: '',
        required: false,
        columnSpan: 1,
        validationRules: [],
        options: [],
      });
    }
  }, [field, open]);

  const handleChange = (key: keyof FormField, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddValidation = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: '',
    };
    setFormData((prev) => ({
      ...prev,
      validationRules: [...(prev.validationRules || []), newRule],
    }));
  };

  const handleUpdateValidation = (index: number, rule: ValidationRule) => {
    setFormData((prev) => ({
      ...prev,
      validationRules: prev.validationRules?.map((r, i) => (i === index ? rule : r)),
    }));
  };

  const handleRemoveValidation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      validationRules: prev.validationRules?.filter((_, i) => i !== index),
    }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), { label: '', value: '' }],
    }));
  };

  const handleUpdateOption = (index: number, option: FieldOption) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.map((o, i) => (i === index ? option : o)),
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!formData.label || !formData.name || !formData.type) {
      return;
    }

    const fieldToSave: FormField = {
      id: field?.id || `field-${Date.now()}`,
      type: formData.type as FieldType,
      label: formData.label,
      name: formData.name,
      placeholder: formData.placeholder,
      required: formData.required || false,
      defaultValue: formData.defaultValue,
      validationRules: formData.validationRules || [],
      options: formData.options || [],
      columnSpan: formData.columnSpan || 1,
      section: formData.section,
      group: formData.group,
      conditionalRender: formData.conditionalRender,
      dependencies: formData.dependencies,
    };

    onSave(fieldToSave);
    onClose();
  };

  const needsOptions = ['dropdown', 'radio'].includes(formData.type || '');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{field ? 'Edit Field' : 'Add New Field'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={formData.type}
                label="Field Type"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {FIELD_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Column Span</InputLabel>
              <Select
                value={formData.columnSpan}
                label="Column Span"
                onChange={(e) => handleChange('columnSpan', e.target.value)}
              >
                <MenuItem value={1}>1 Column</MenuItem>
                <MenuItem value={2}>2 Columns</MenuItem>
                <MenuItem value={3}>3 Columns</MenuItem>
                <MenuItem value={4}>4 Columns</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Label"
              value={formData.label}
              onChange={(e) => handleChange('label', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name (Field ID)"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              required
              helperText="Used as field identifier"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Placeholder"
              value={formData.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Default Value"
              value={formData.defaultValue || ''}
              onChange={(e) => handleChange('defaultValue', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.required || false}
                  onChange={(e) => handleChange('required', e.target.checked)}
                />
              }
              label="Required Field"
            />
          </Grid>

          {needsOptions && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Options</Typography>
                <Button startIcon={<Add />} onClick={handleAddOption} size="small">
                  Add Option
                </Button>
              </Box>
              {formData.options?.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Label"
                    value={option.label}
                    onChange={(e) =>
                      handleUpdateOption(index, { ...option, label: e.target.value })
                    }
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Value"
                    value={option.value}
                    onChange={(e) =>
                      handleUpdateOption(index, { ...option, value: e.target.value })
                    }
                    sx={{ flex: 1 }}
                  />
                  <IconButton onClick={() => handleRemoveOption(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Validation Rules</Typography>
              <Button startIcon={<Add />} onClick={handleAddValidation} size="small">
                Add Rule
              </Button>
            </Box>
            {formData.validationRules?.map((rule, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Rule Type</InputLabel>
                      <Select
                        value={rule.type}
                        label="Rule Type"
                        onChange={(e) =>
                          handleUpdateValidation(index, { ...rule, type: e.target.value as ValidationRule['type'] })
                        }
                      >
                        {VALIDATION_TYPES.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {['minLength', 'maxLength', 'min', 'max', 'pattern'].includes(rule.type) && (
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Value"
                        value={rule.value || ''}
                        onChange={(e) =>
                          handleUpdateValidation(index, { ...rule, value: e.target.value })
                        }
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={rule.type === 'required' ? 8 : 4}>
                    <TextField
                      fullWidth
                      label="Error Message"
                      value={rule.message || ''}
                      onChange={(e) =>
                        handleUpdateValidation(index, { ...rule, message: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <IconButton onClick={() => handleRemoveValidation(index)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {field && onDelete && (
          <Button onClick={onDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!formData.label || !formData.name}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
