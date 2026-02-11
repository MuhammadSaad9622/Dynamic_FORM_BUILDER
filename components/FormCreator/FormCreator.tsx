'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DragIndicator,
  Save,
  Visibility,
  ArrowBack,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FormSchema, FormField } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import FieldEditor from './FieldEditor';
import { useRouter } from 'next/navigation';

interface FormCreatorProps {
  formId?: string;
}

export default function FormCreator({ formId }: FormCreatorProps) {
  const router = useRouter();
  const { getForm, addForm, updateForm, deleteForm } = useFormStore();
  const [form, setForm] = useState<Partial<FormSchema>>({
    name: '',
    description: '',
    fields: [],
    sections: [],
    groups: [],
    version: 1,
  });
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldEditorOpen, setFieldEditorOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (formId) {
      const existingForm = getForm(formId);
      if (existingForm) {
        setForm(existingForm);
      }
    }
  }, [formId, getForm]);

  const handleAddField = () => {
    setEditingField(null);
    setFieldEditorOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldEditorOpen(true);
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      setForm((prev) => ({
        ...prev,
        fields: prev.fields?.map((f) => (f.id === field.id ? field : f)),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        fields: [...(prev.fields || []), field],
      }));
    }
    setFieldEditorOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = () => {
    if (fieldToDelete) {
      setForm((prev) => ({
        ...prev,
        fields: prev.fields?.filter((f) => f.id !== fieldToDelete),
      }));
      setFieldToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(form.fields || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setForm((prev) => ({ ...prev, fields: items }));
  };

  const handleSaveForm = () => {
    if (!form.name || !form.fields || form.fields.length === 0) {
      return;
    }

    const formToSave: FormSchema = {
      id: formId || `form-${Date.now()}`,
      name: form.name,
      description: form.description,
      version: form.version || 1,
      fields: form.fields,
      sections: form.sections || [],
      groups: form.groups || [],
      createdAt: form.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (formId) {
      updateForm(formId, formToSave);
    } else {
      addForm(formToSave);
    }

    router.push('/');
  };

  const handleDeleteForm = () => {
    if (formId) {
      deleteForm(formId);
      router.push('/');
    }
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: '#1976d2',
      email: '#2e7d32',
      password: '#ed6c02',
      textarea: '#9c27b0',
      date: '#d32f2f',
      datetime: '#c2185b',
      dropdown: '#0288d1',
      checkbox: '#00796b',
      radio: '#f57c00',
      toggle: '#5e35b1',
    };
    return colors[type] || '#757575';
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        minHeight: '100vh',
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <IconButton 
            onClick={() => router.push('/')} 
            sx={{ 
              p: { xs: 1, sm: 1.5 },
              background: 'white',
              border: '1px solid #e2e8f0',
              '&:hover': {
                background: '#f8fafc',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2.125rem' },
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              {formId ? 'Edit Form' : 'Create New Form'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formId ? 'Modify your form fields and settings' : 'Build your dynamic form step by step'}
            </Typography>
          </Box>
        </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={8}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              background: 'white',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 2.5,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}
              >
                Form Details
              </Typography>
            </Box>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Form Name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                  required
                  size="small"
                  placeholder="Enter a descriptive name for your form"
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={form.description || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={3}
                  size="small"
                  placeholder="Describe what this form is for (optional)"
                />
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                  pt: 3,
                  borderTop: '2px solid #f1f5f9',
                }}
              >
                <Box>
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontSize: { xs: '1.125rem', sm: '1.25rem' },
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Form Fields
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {form.fields?.length || 0} {form.fields?.length === 1 ? 'field' : 'fields'} added
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  onClick={handleAddField}
                  size="medium"
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    px: 3,
                  }}
                >
                  Add Field
                </Button>
              </Box>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided) => (
                      <Box {...provided.droppableProps} ref={provided.innerRef}>
                        {form.fields?.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                elevation={0}
                                sx={{
                                  p: 2.5,
                                  mb: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  backgroundColor: snapshot.isDragging ? '#f1f5f9' : 'white',
                                  border: snapshot.isDragging ? '2px solid #667eea' : '1px solid #e2e8f0',
                                  borderRadius: 2,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    borderColor: '#cbd5e1',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                  }
                                }}
                              >
                                <Box 
                                  {...provided.dragHandleProps} 
                                  sx={{ 
                                    cursor: 'grab',
                                    color: '#94a3b8',
                                    '&:hover': { color: '#667eea' },
                                    transition: 'color 0.2s',
                                  }}
                                >
                                  <DragIndicator />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                      label={field.type}
                                      size="small"
                                      sx={{
                                        background: getFieldTypeColor(field.type),
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '0.938rem' }}>
                                      {field.label}
                                    </Typography>
                                    {field.required && (
                                      <Chip 
                                        label="Required" 
                                        size="small" 
                                        sx={{
                                          background: '#fee2e2',
                                          color: '#991b1b',
                                          fontWeight: 500,
                                          fontSize: '0.688rem',
                                        }}
                                      />
                                    )}
                                    <Chip 
                                      label={`${field.columnSpan} cols`} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{
                                        borderColor: '#cbd5e1',
                                        color: '#64748b',
                                        fontSize: '0.688rem',
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                                    <strong>Name:</strong> {field.name}
                                    {field.placeholder && ` • <strong>Placeholder:</strong> ${field.placeholder}`}
                                  </Typography>
                                </Box>
                                <IconButton
                                  onClick={() => handleEditField(field)}
                                  size="small"
                                  sx={{
                                    color: '#667eea',
                                    '&:hover': {
                                      background: 'rgba(102, 126, 234, 0.1)',
                                    }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setFieldToDelete(field.id);
                                    setDeleteConfirmOpen(true);
                                  }}
                                  size="small"
                                  sx={{
                                    color: '#ef4444',
                                    '&:hover': {
                                      background: 'rgba(239, 68, 68, 0.1)',
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>

                {(!form.fields || form.fields.length === 0) && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 6,
                      px: 3,
                      border: '2px dashed #e2e8f0',
                      borderRadius: 2,
                      background: '#f8fafc',
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        opacity: 0.7,
                      }}
                    >
                      <Add sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                      No fields added yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Click &quot;Add Field&quot; to start building your form
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddField}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        },
                      }}
                    >
                      Add Your First Field
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                position: { md: 'sticky' },
                top: { md: 20 },
                background: 'white',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: 2.5,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Form Preview
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box
                  sx={{
                    p: 3,
                    border: '2px dashed #cbd5e1',
                    borderRadius: 2,
                    minHeight: 300,
                    backgroundColor: '#f8fafc',
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)',
                  }}
                >
                  {form.fields && form.fields.length > 0 ? (
                    <Grid container spacing={2}>
                      {form.fields.map((field) => (
                        <Grid 
                          item 
                          xs={field.columnSpan === 4 ? 12 : field.columnSpan === 3 ? 12 : field.columnSpan === 2 ? 6 : 6}
                          key={field.id}
                        >
                          <Box
                            sx={{
                              p: 2,
                              border: '1px solid #e2e8f0',
                              borderRadius: 1.5,
                              backgroundColor: 'white',
                              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <Typography 
                              variant="caption" 
                              display="block" 
                              gutterBottom
                              sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: '0.813rem',
                              }}
                            >
                              {field.label}
                              {field.required && <span style={{ color: '#ef4444' }}> *</span>}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              [{field.type}]
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Preview will appear here
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveForm}
                    disabled={!form.name || !form.fields || form.fields.length === 0}
                    fullWidth
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: '#e2e8f0',
                        color: '#94a3b8',
                      },
                      transition: 'all 0.3s ease',
                      py: 1.5,
                    }}
                  >
                    Save Form
                  </Button>
                  {formId && (
                    <Button
                      variant="outlined"
                      startIcon={<Delete />}
                      onClick={handleDeleteForm}
                      fullWidth
                      sx={{
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        '&:hover': {
                          borderColor: '#dc2626',
                          background: 'rgba(239, 68, 68, 0.1)',
                        },
                      }}
                    >
                      Delete Form
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <FieldEditor
        field={editingField}
        open={fieldEditorOpen}
        onClose={() => {
          setFieldEditorOpen(false);
          setEditingField(null);
        }}
        onSave={handleSaveField}
        onDelete={handleDeleteField}
      />

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Field</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this field? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteField} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
