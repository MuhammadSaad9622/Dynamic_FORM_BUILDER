# Dynamic Form Builder System

A comprehensive, production-ready Dynamic Form Builder System built with Next.js, React, TypeScript, Material UI, and Zustand. This system allows you to create, render, and manage dynamic forms with a beautiful, responsive UI.

## Features

### 1. Form Creator
- **Dynamic Field Creation**: Create forms with multiple field types:
  - Text, Email, Password, TextArea
  - Date, DateTime
  - Dropdown, Checkbox, Radio Group
  - Toggle (Switch)
- **Field Configuration**: Each field supports:
  - Label, Name, Placeholder
  - Required flag
  - Default value
  - Validation rules (required, minLength, maxLength, pattern, min, max)
  - Options (for dropdown and radio)
  - Column span (1-4 columns)
- **Layout Management**:
  - 4-column grid system
  - Drag-and-drop field reordering
  - Visual preview
- **Form Management**:
  - Create, edit, and delete forms
  - Form versioning support
  - JSON schema generation

### 2. Form Renderer
- **Dynamic Rendering**: Renders forms from JSON schema
- **Validation**: Real-time and on-submit validation
- **User Features**:
  - Submit form (saves data)
  - Clear form
  - Save as draft
  - Auto-load drafts on return

### 3. Data Renderer
- **Submission Management**:
  - List all submitted records
  - Detail view with proper layout
  - Edit existing submissions
  - Delete submissions
- **Form Version Compatibility**: Maintains compatibility with form versions

## Tech Stack

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Material UI (MUI)**: Component library and theming
- **Zustand**: Lightweight state management
- **react-beautiful-dnd**: Drag and drop functionality
- **date-fns**: Date formatting utilities

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with MUI theme
│   ├── page.tsx                # Home page (forms list)
│   ├── theme.ts                # MUI theme configuration
│   ├── globals.css             # Global styles
│   └── form/
│       ├── create/             # Create new form
│       ├── edit/[id]/          # Edit existing form
│       ├── view/[id]/          # View/render form
│       └── submissions/[id]/  # View form submissions
├── components/
│   ├── FormCreator/
│   │   ├── FormCreator.tsx     # Main form creator component
│   │   └── FieldEditor.tsx     # Field configuration dialog
│   ├── FormRenderer/
│   │   └── FormRenderer.tsx    # Form rendering component
│   └── DataRenderer/
│       └── DataRenderer.tsx    # Submissions management
├── store/
│   └── formStore.ts            # Zustand store for state management
├── types/
│   └── form.ts                 # TypeScript type definitions
└── utils/
    └── validation.ts           # Form validation utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Assignement
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Usage Guide

### Creating a Form

1. Click "Create New Form" on the home page
2. Enter form name and description
3. Click "Add Field" to add form fields
4. Configure each field:
   - Select field type
   - Set label, name, placeholder
   - Configure validation rules
   - Set column span
   - Add options (for dropdown/radio)
5. Drag fields to reorder
6. Click "Save Form" when done

### Rendering a Form

1. From the home page, click the eye icon on any form
2. Fill out the form fields
3. Use "Save Draft" to save progress
4. Click "Submit" when ready

### Viewing Submissions

1. Click the document icon on any form card
2. View all submissions in a table
3. Click the eye icon to view details
4. Click the edit icon to modify submissions
5. Click the delete icon to remove submissions

## Sample JSON Schema

The system generates and uses JSON schemas for forms. Here's a sample schema structure:

```json
{
  "id": "form-123",
  "name": "Contact Form",
  "description": "A sample contact form",
  "version": 1,
  "fields": [
    {
      "id": "field-1",
      "type": "text",
      "label": "Full Name",
      "name": "fullName",
      "placeholder": "Enter your full name",
      "required": true,
      "columnSpan": 2,
      "validationRules": [
        {
          "type": "required",
          "message": "Full name is required"
        },
        {
          "type": "minLength",
          "value": 2,
          "message": "Name must be at least 2 characters"
        }
      ]
    },
    {
      "id": "field-2",
      "type": "email",
      "label": "Email Address",
      "name": "email",
      "placeholder": "Enter your email",
      "required": true,
      "columnSpan": 2,
      "validationRules": [
        {
          "type": "required",
          "message": "Email is required"
        },
        {
          "type": "pattern",
          "value": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
          "message": "Invalid email format"
        }
      ]
    },
    {
      "id": "field-3",
      "type": "dropdown",
      "label": "Country",
      "name": "country",
      "required": true,
      "columnSpan": 2,
      "options": [
        { "label": "United States", "value": "us" },
        { "label": "Canada", "value": "ca" },
        { "label": "United Kingdom", "value": "uk" }
      ]
    }
  ],
  "sections": [],
  "groups": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Architecture

### State Management (Zustand)

The application uses Zustand for state management with a single store (`formStore`) that manages:

- **Forms**: List of all form schemas
- **Submissions**: All form submissions
- **Drafts**: Auto-saved draft data

### Type Safety

All components and utilities are fully typed with TypeScript, ensuring:
- Type safety across the application
- Better IDE autocomplete
- Compile-time error detection

### Validation System

The validation system supports:
- Required field validation
- Min/Max length validation
- Pattern matching (regex)
- Min/Max value validation
- Custom validation rules

### Edge Cases Handled

- **Form Versioning**: Forms maintain version numbers for compatibility
- **Draft Management**: Auto-save and restore drafts
- **Field Dependencies**: Support for conditional rendering (defined in schema)
- **Dynamic Data Rendering**: Proper handling of different data types
- **Error Handling**: Comprehensive error messages and validation feedback

## UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Material Design**: Clean, professional MUI components
- **Drag & Drop**: Intuitive field reordering
- **Real-time Preview**: See form layout as you build
- **Validation Feedback**: Clear error messages
- **Loading States**: Visual feedback during operations
- **Success Messages**: Confirmation for successful actions

## Development

### Code Quality

- TypeScript for type safety
- Component-based architecture
- Reusable utility functions
- Clean separation of concerns

### Future Enhancements

Potential features for future development:
- Form sections and groups UI
- Conditional field rendering UI
- Export/import form schemas
- Form templates
- Advanced validation rules
- Multi-step forms
- File upload fields
- Rich text editor fields

## License

This project is created for educational/assignment purposes.

## Author

Created as a coding assignment demonstrating:
- Next.js and React expertise
- TypeScript proficiency
- State management with Zustand
- Material UI component usage
- Complex form handling
- Professional UI/UX design
