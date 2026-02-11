'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Switch,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  ArrowBack,
} from '@mui/icons-material';
import { FormSubmission, FormSchema } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { format } from 'date-fns';

interface DataRendererProps {
  formId: string;
}

export default function DataRenderer({ formId }: DataRendererProps) {
  const { getSubmissionsByFormId, getForm, deleteSubmission, updateSubmission } = useFormStore();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [form, setForm] = useState<FormSchema | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, any>>({});

  React.useEffect(() => {
    const formData = getForm(formId);
    if (formData) {
      setForm(formData);
      const subs = getSubmissionsByFormId(formId);
      setSubmissions(subs);
    }
  }, [formId, getForm, getSubmissionsByFormId]);

  const handleView = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleEdit = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setEditData(submission.data);
    setEditDialogOpen(true);
  };

  const handleDelete = (submissionId: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      deleteSubmission(submissionId);
      const subs = getSubmissionsByFormId(formId);
      setSubmissions(subs);
    }
  };

  const handleSaveEdit = () => {
    if (selectedSubmission) {
      updateSubmission(selectedSubmission.id, { data: editData });
      const subs = getSubmissionsByFormId(formId);
      setSubmissions(subs);
      setEditDialogOpen(false);
      setSelectedSubmission(null);
      setEditData({});
    }
  };

  const getFieldLabel = (fieldName: string): string => {
    if (!form) return fieldName;
    const field = form.fields.find((f) => f.name === fieldName);
    return field?.label || fieldName;
  };

  const renderFieldValue = (fieldName: string, value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (!form) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Form not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {form.name} - Submissions
        </Typography>
        <Chip label={`${submissions.length} submissions`} color="primary" />
      </Box>

      {submissions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              No submissions yet for this form.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Preview</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {format(new Date(submission.submittedAt), 'PPp')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status}
                      color={submission.status === 'submitted' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {Object.entries(submission.data)
                        .slice(0, 2)
                        .map(([key, value]) => `${getFieldLabel(key)}: ${renderFieldValue(key, value)}`)
                        .join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleView(submission)}
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(submission)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(submission.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Submission Details
          <Typography variant="caption" display="block" color="text.secondary">
            {selectedSubmission &&
              format(new Date(selectedSubmission.submittedAt), 'PPp')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && form && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {form.fields.map((field) => {
                const value = selectedSubmission.data[field.name];
                return (
                  <Grid item xs={12} sm={(12 / 4) * (field.columnSpan || 1)} key={field.id}>
                    <TextField
                      fullWidth
                      label={field.label}
                      value={renderFieldValue(field.name, value)}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedSubmission(null);
          setEditData({});
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Submission</DialogTitle>
        <DialogContent>
          {selectedSubmission && form && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {form.fields.map((field) => {
                  const value = editData[field.name] ?? '';
                  
                  if (field.type === 'dropdown') {
                    return (
                      <Grid item xs={12} sm={(12 / 4) * (field.columnSpan || 1)} key={field.id}>
                        <FormControl fullWidth required={field.required}>
                          <InputLabel>{field.label}</InputLabel>
                          <Select
                            value={value}
                            label={field.label}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, [field.name]: e.target.value }))
                            }
                          >
                            {field.options?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    );
                  }
                  
                  if (field.type === 'radio') {
                    return (
                      <Grid item xs={12} sm={(12 / 4) * (field.columnSpan || 1)} key={field.id}>
                        <FormControl component="fieldset" required={field.required}>
                          <FormLabel component="legend">{field.label}</FormLabel>
                          <RadioGroup
                            value={value}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, [field.name]: e.target.value }))
                            }
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
                        </FormControl>
                      </Grid>
                    );
                  }
                  
                  if (field.type === 'checkbox') {
                    return (
                      <Grid item xs={12} sm={(12 / 4) * (field.columnSpan || 1)} key={field.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!value}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, [field.name]: e.target.checked }))
                              }
                            />
                          }
                          label={field.label}
                        />
                      </Grid>
                    );
                  }
                  
                  if (field.type === 'toggle') {
                    return (
                      <Grid item xs={12} sm={(12 / 4) * (field.columnSpan || 1)} key={field.id}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!value}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, [field.name]: e.target.checked }))
                              }
                            />
                          }
                          label={field.label}
                        />
                      </Grid>
                    );
                  }
                  
                  return (
                    <Grid item xs={12} sm={(12 / 4) * (field.columnSpan || 1)} key={field.id}>
                      <TextField
                        fullWidth
                        label={field.label}
                        value={value}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        required={field.required}
                        type={
                          field.type === 'email'
                            ? 'email'
                            : field.type === 'password'
                            ? 'password'
                            : field.type === 'date'
                            ? 'date'
                            : field.type === 'datetime'
                            ? 'datetime-local'
                            : 'text'
                        }
                        multiline={field.type === 'textarea'}
                        rows={field.type === 'textarea' ? 4 : 1}
                        InputLabelProps={
                          field.type === 'date' || field.type === 'datetime'
                            ? { shrink: true }
                            : undefined
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditDialogOpen(false);
              setSelectedSubmission(null);
              setEditData({});
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
