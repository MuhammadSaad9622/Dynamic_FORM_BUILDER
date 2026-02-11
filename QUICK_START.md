# Quick Start Guide

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000`

## First Steps

1. **Create Your First Form:**
   - Click "Create New Form" on the home page
   - Enter a form name (e.g., "Contact Form")
   - Click "Add Field" to add form fields
   - Configure each field with type, label, validation, etc.
   - Click "Save Form" when done

2. **Test the Form:**
   - Go back to home page
   - Click the eye icon (👁️) on your form card
   - Fill out and submit the form

3. **View Submissions:**
   - Click the document icon (📄) on the form card
   - View, edit, or delete submissions

## Sample Form

The system comes with a sample "Contact Form" pre-loaded. You can:
- View it to see how forms work
- Edit it to customize
- Use it as a template

## Key Features to Try

- **Drag & Drop**: Reorder fields in the form creator
- **Validation**: Add validation rules and see them in action
- **Draft Saving**: Start filling a form, save as draft, come back later
- **Multiple Field Types**: Try all field types (text, email, dropdown, radio, etc.)
- **Column Layout**: Use column spans (1-4) to create custom layouts

## Troubleshooting

If you encounter issues:

1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version:**
   Ensure you're using Node.js 18 or higher

3. **Port already in use:**
   Change the port: `npm run dev -- -p 3001`
