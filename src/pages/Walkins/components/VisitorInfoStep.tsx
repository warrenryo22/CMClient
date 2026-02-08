import Input from '@/components/input/InputField';
import DatePicker from '@/components/input/DatePicker';
import { User } from 'lucide-react';

interface VisitorInfoStepProps {
  firstName?: string;
  lastName?: string;
  birthDate?: Date | null;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeBirthDate: (date?: Date ) => void;
}

const VisitorInfoStep = ({
  firstName,
  lastName,
  birthDate,
  onChangeFirstName,
  onChangeLastName,
  onChangeBirthDate,
}: VisitorInfoStepProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-sky-700 dark:text-sky-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Visitor Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your basic information
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => onChangeFirstName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => onChangeLastName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <DatePicker
            id="visitor-birthdate"
            value={birthDate}
            onChange={(value) => {
              if (Array.isArray(value)) {
                onChangeBirthDate(value[0]);
              } else {
                onChangeBirthDate(value ?? undefined);
              }
            }}
            placeholder="Select your date of birth"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
          <strong>Privacy Notice:</strong> Your information is kept confidential and will only be used for medical records purposes.
        </p>
      </div>
    </div>
  );
};

export default VisitorInfoStep;
