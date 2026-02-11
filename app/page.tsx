'use client';

import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Description,
} from '@mui/icons-material';
import { useFormStore } from '@/store/formStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { forms, initialize, deleteForm, getSubmissionsByFormId } = useFormStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleCreateForm = () => {
    router.push('/form/create');
  };

  const handleEditForm = (formId: string) => {
    router.push(`/form/edit/${formId}`);
  };

  const handleViewForm = (formId: string) => {
    router.push(`/form/view/${formId}`);
  };

  const handleViewSubmissions = (formId: string) => {
    router.push(`/form/submissions/${formId}`);
  };

  const handleDeleteForm = (formId: string) => {
    if (confirm('Are you sure you want to delete this form? All submissions will also be deleted.')) {
      deleteForm(formId);
    }
  };

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              p: 1,
              mr: 2,
            }}
          >
            <Description sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, color: 'white' }} />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.01em',
            }}
          >
            Dynamic Form Builder
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 3 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.5rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                Forms
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Create and manage your dynamic forms
              </Typography>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateForm}
                size="large"
                fullWidth={{ xs: true, sm: false }}
                sx={{ 
                  maxWidth: { xs: '100%', sm: 'none' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  px: 3,
                  py: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                Create New Form
              </Button>
            </Box>
          </Box>

          {forms.length === 0 ? (
            <Card
              sx={{
                textAlign: 'center',
                py: { xs: 6, sm: 10 },
                px: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px dashed #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Description sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 1.5,
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                No forms created yet
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  maxWidth: 400,
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                Get started by creating your first dynamic form. Build beautiful, responsive forms with our intuitive form builder.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateForm}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  px: 4,
                  py: 1.5,
                }}
              >
                Create Your First Form
              </Button>
            </Card>
          ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {forms.map((form) => {
              const submissions = getSubmissionsByFormId(form.id);
              return (
                <Grid item xs={12} sm={6} md={4} key={form.id}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderColor: '#cbd5e1',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: 4,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, sm: 3 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          component="h2"
                          sx={{ 
                            fontSize: { xs: '1.125rem', sm: '1.25rem' },
                            fontWeight: 700,
                            pr: 1,
                            color: 'text.primary',
                            lineHeight: 1.3,
                          }}
                        >
                          {form.name}
                        </Typography>
                        <Chip 
                          label={`v${form.version}`} 
                          size="small" 
                          sx={{ 
                            flexShrink: 0,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                            height: 24,
                          }}
                        />
                      </Box>
                      {form.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2.5, 
                            fontSize: { xs: '0.813rem', sm: '0.875rem' },
                            lineHeight: 1.6,
                            minHeight: 40,
                          }}
                        >
                          {form.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <Chip
                          label={`${form.fields.length} ${form.fields.length === 1 ? 'field' : 'fields'}`}
                          size="small"
                          sx={{
                            background: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 500,
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <Chip
                          label={`${submissions.length} ${submissions.length === 1 ? 'submission' : 'submissions'}`}
                          size="small"
                          sx={{
                            background: '#fef3c7',
                            color: '#92400e',
                            fontWeight: 500,
                            border: '1px solid #fde68a',
                          }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions 
                      sx={{ 
                        justifyContent: 'space-between', 
                        px: { xs: 2, sm: 3 }, 
                        pb: { xs: 2, sm: 3 },
                        pt: 0,
                        flexWrap: 'wrap',
                        gap: { xs: 0.5, sm: 1 },
                        borderTop: '1px solid #f1f5f9',
                        background: '#fafbfc',
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewForm(form.id)}
                          title="View Form"
                          sx={{ 
                            p: { xs: 0.75, sm: 1 },
                            color: '#667eea',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.1)',
                            }
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditForm(form.id)}
                          title="Edit Form"
                          sx={{ 
                            p: { xs: 0.75, sm: 1 },
                            color: '#667eea',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.1)',
                            }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleViewSubmissions(form.id)}
                          title="View Submissions"
                          sx={{ 
                            p: { xs: 0.75, sm: 1 },
                            color: '#ec4899',
                            '&:hover': {
                              background: 'rgba(236, 72, 153, 0.1)',
                            }
                          }}
                        >
                          <Description fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteForm(form.id)}
                        title="Delete Form"
                        sx={{ 
                          p: { xs: 0.75, sm: 1 },
                          color: '#ef4444',
                          '&:hover': {
                            background: 'rgba(239, 68, 68, 0.1)',
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
        </Container>
      </Box>
    </>
  );
}
