import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FormSchema, FormSubmission, FormDraft } from '@/types/form';

interface FormStore {
  forms: FormSchema[];
  submissions: FormSubmission[];
  drafts: FormDraft[];
  
  // Form CRUD
  addForm: (form: FormSchema) => void;
  updateForm: (id: string, form: Partial<FormSchema>) => void;
  deleteForm: (id: string) => void;
  getForm: (id: string) => FormSchema | undefined;
  getFormByVersion: (id: string, version: number) => FormSchema | undefined;
  
  // Submissions
  addSubmission: (submission: FormSubmission) => void;
  updateSubmission: (id: string, submission: Partial<FormSubmission>) => void;
  deleteSubmission: (id: string) => void;
  getSubmissionsByFormId: (formId: string) => FormSubmission[];
  getSubmission: (id: string) => FormSubmission | undefined;
  
  // Drafts
  saveDraft: (formId: string, data: Record<string, any>) => void;
  getDraft: (formId: string) => FormDraft | undefined;
  deleteDraft: (formId: string) => void;
  
  // Initialize with sample data
  initialize: () => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: [],
      submissions: [],
      drafts: [],
      
      addForm: (form) => {
        set((state) => ({
          forms: [...state.forms, form],
        }));
      },
  
  updateForm: (id, updates) => {
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === id
          ? { ...form, ...updates, updatedAt: new Date().toISOString() }
          : form
      ),
    }));
  },
  
  deleteForm: (id) => {
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== id),
      submissions: state.submissions.filter((sub) => sub.formId !== id),
      drafts: state.drafts.filter((draft) => draft.formId !== id),
    }));
  },
  
  getForm: (id) => {
    return get().forms.find((form) => form.id === id);
  },
  
  getFormByVersion: (id, version) => {
    return get().forms.find((form) => form.id === id && form.version === version);
  },
  
  addSubmission: (submission) => {
    set((state) => ({
      submissions: [...state.submissions, submission],
      drafts: state.drafts.filter((draft) => draft.formId !== submission.formId),
    }));
  },
  
  updateSubmission: (id, updates) => {
    set((state) => ({
      submissions: state.submissions.map((sub) =>
        sub.id === id
          ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
          : sub
      ),
    }));
  },
  
  deleteSubmission: (id) => {
    set((state) => ({
      submissions: state.submissions.filter((sub) => sub.id !== id),
    }));
  },
  
  getSubmissionsByFormId: (formId) => {
    return get().submissions.filter((sub) => sub.formId === formId);
  },
  
  getSubmission: (id) => {
    return get().submissions.find((sub) => sub.id === id);
  },
  
  saveDraft: (formId, data) => {
    set((state) => {
      const existingDraft = state.drafts.find((d) => d.formId === formId);
      if (existingDraft) {
        return {
          drafts: state.drafts.map((draft) =>
            draft.formId === formId
              ? { ...draft, data, lastSaved: new Date().toISOString() }
              : draft
          ),
        };
      }
      return {
        drafts: [...state.drafts, { formId, data, lastSaved: new Date().toISOString() }],
      };
    });
  },
  
  getDraft: (formId) => {
    return get().drafts.find((draft) => draft.formId === formId);
  },
  
  deleteDraft: (formId) => {
    set((state) => ({
      drafts: state.drafts.filter((draft) => draft.formId !== formId),
    }));
  },
  
  initialize: () => {
    // Initialize with sample form if no forms exist
    if (get().forms.length === 0) {
      const sampleForm: FormSchema = {
        id: 'sample-1',
        name: 'Sample Contact Form',
        description: 'A sample form to demonstrate the form builder',
        version: 1,
        fields: [
          {
            id: 'field-1',
            type: 'text',
            label: 'Full Name',
            name: 'fullName',
            placeholder: 'Enter your full name',
            required: true,
            columnSpan: 2,
            validationRules: [
              { type: 'required', message: 'Full name is required' },
              { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
            ],
          },
          {
            id: 'field-2',
            type: 'email',
            label: 'Email Address',
            name: 'email',
            placeholder: 'Enter your email',
            required: true,
            columnSpan: 2,
            validationRules: [
              { type: 'required', message: 'Email is required' },
              { type: 'pattern', value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: 'Invalid email format' },
            ],
          },
          {
            id: 'field-3',
            type: 'textarea',
            label: 'Message',
            name: 'message',
            placeholder: 'Enter your message',
            required: false,
            columnSpan: 4,
            validationRules: [
              { type: 'maxLength', value: 500, message: 'Message must be less than 500 characters' },
            ],
          },
        ],
        sections: [],
        groups: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ forms: [sampleForm] });
    }
  },
    }),
    {
      name: 'form-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        forms: state.forms,
        submissions: state.submissions,
        drafts: state.drafts,
      }),
    }
  )
);
