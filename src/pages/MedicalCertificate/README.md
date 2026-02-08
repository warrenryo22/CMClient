# Medical Certificate System

A comprehensive medical certificate creation system with AI assistance and e-signature functionality for the Clinic Management System.

## Features

### 1. **Medical Certificate Form**
- Pre-filled patient information from medical records
- Comprehensive form fields:
  - Patient Information (Name, ID, DOB, Address)
  - Medical Details (Diagnosis, Chief Complaint, Physical Examination, Recommendations)
  - Rest/Leave Period (From/To dates, Number of days, Fit to work status)
  - Doctor Information (Name, License Number, E-Signature)

### 2. **AI-Assisted Data Generation**
- Click "AI Assist" button to auto-generate medical certificate content
- 6 different mock scenarios for common medical conditions:
  - Acute Upper Respiratory Tract Infection (URTI)
  - Acute Gastroenteritis
  - Tension-Type Headache
  - Minor Ankle Sprain
  - Allergic Rhinitis
  - Contact Dermatitis
- Each suggestion includes diagnosis, chief complaint, physical examination, recommendations, rest period, and restrictions

### 3. **E-Signature Integration**
- Digital signature pad for doctors
- Converts signature to PNG image format
- Signs electronically before certificate creation
- Preview signature before saving

### 4. **Certificate Preview & Print**
- Professional certificate layout
- Print-optimized design
- Download as PDF (ready for implementation)
- Official school header with logo
- Clear certification statement
- Doctor's signature display

## Installation

### Required Package

Due to PowerShell execution policy restrictions, you need to install the signature library manually:

#### Option 1: Change Execution Policy (Recommended)
\`\`\`powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then install the package
npm install react-signature-canvas @types/react-signature-canvas
\`\`\`

#### Option 2: Use Command Prompt
\`\`\`cmd
# Open Command Prompt (cmd) and navigate to project directory
npm install react-signature-canvas @types/react-signature-canvas
\`\`\`

#### Option 3: Bypass for Single Command
\`\`\`powershell
powershell -ExecutionPolicy Bypass -Command "npm install react-signature-canvas @types/react-signature-canvas"
\`\`\`

## Usage

### Creating a Medical Certificate

1. **Navigate to Medical Record View**
   - Go to any medical record details page
   - Click the "Create Medical Certificate" button (purple gradient button)

2. **Fill Out the Form**
   - Patient information is pre-filled from the medical record
   - Fill in all required fields marked with *
   - Use the "AI Assist" button for quick mock data generation
   - Click "Generate New" in the AI modal to try different scenarios

3. **Add Doctor Signature**
   - Click "Add Signature" button
   - Draw your signature using mouse/touchpad
   - Click "Save Signature" to apply

4. **Preview and Submit**
   - Click "Preview" to see how the certificate will look
   - Click "Create Certificate" to submit
   - If no signature is added, the signature modal will automatically open

5. **Download or Print**
   - In the preview page, click "Print" or "Download PDF"

## File Structure

\`\`\`
src/pages/MedicalCertificate/
├── components/
│   ├── AIAssistModal.tsx          # AI assistance modal
│   ├── ESignatureModal.tsx        # E-signature pad modal
├── types.ts                        # TypeScript interfaces
├── mockData.ts                     # AI mock suggestions
├── utils.ts                        # Utility functions
├── MedicalCertificateForm.tsx     # Main form component
├── CertificatePreview.tsx         # Preview/View component
├── index.tsx                       # Exports
└── README.md                       # This file
\`\`\`

## Routes to Add

Add these routes to your routing configuration:

\`\`\`tsx
import { MedicalCertificateForm, CertificatePreview } from '@/pages/MedicalCertificate';

// In your routes array:
{
  path: '/medical-certificate/create/:medId',
  element: <MedicalCertificateForm />
},
{
  path: '/medical-certificate/preview/:medId',
  element: <CertificatePreview />
}
\`\`\`

## API Integration

The system uses mock data currently. To integrate with your backend:

1. **Update MedicalCertificateForm.tsx**
   - Replace `handleSubmit` function with actual API call
   - Send `formData` including the `doctorSignature` (base64 PNG image)

2. **Backend Endpoint Example**
   \`\`\`typescript
   POST /api/medical-certificates
   Body: {
     medicalRecordId: number,
     patientName: string,
     patientId: string,
     diagnosis: string,
     // ... other fields
     doctorSignature: string // Base64 PNG image
   }
   \`\`\`

3. **Image Upload**
   - The signature is already in PNG format (base64)
   - Backend should decode and save as PNG file
   - Return the file URL to display on certificate

## Customization

### Changing Certificate Layout
Edit `CertificatePreview.tsx` to modify the certificate design.

### Adding More AI Scenarios
Add new scenarios to `mockData.ts` in the `aiMockSuggestions` array.

### Modifying Form Fields
Update `types.ts` and `MedicalCertificateForm.tsx` to add/remove fields.

## Notes

- The signature is saved as a PNG image (base64 encoded)
- All dates are handled using the DatePicker component
- The form validates required fields before submission
- Preview page is print-optimized with proper styling
- Dark mode support is included throughout

## Future Enhancements

1. PDF generation using libraries like `jsPDF` or `pdfmake`
2. Certificate template selection
3. Batch certificate generation
4. Certificate verification system with QR codes
5. Certificate history and management
6. Email certificate directly to patient
7. Multiple language support
