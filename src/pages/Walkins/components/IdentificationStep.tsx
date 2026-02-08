import { useState } from 'react';
import { UserRoles } from '@/enums/commons';
import Input from '@/components/input/InputField';
import { getIdentificationLabel, validateIdentificationNumber } from '../utils';
import { BadgeCheck, AlertCircle } from 'lucide-react';

interface IdentificationStepProps {
  role: UserRoles;
  identificationNumber: string;
  onChangeId: (id: string) => void;
  onValidate: () => Promise<boolean>;
}

const IdentificationStep = ({
  role,
  identificationNumber,
  onChangeId,
  onValidate,
}: IdentificationStepProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleValidate = async () => {
    setValidationError(null);
    
    // Client-side validation first
    if (!validateIdentificationNumber(identificationNumber, role)) {
      setValidationError('Invalid identification number format');
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    try {
      const result = await onValidate();
      if (result) {
        setIsValid(true);
        setValidationError(null);
      } else {
        setValidationError('Identification number not found in the system');
        setIsValid(false);
      }
    } catch (error) {
      setValidationError('Failed to validate. Please try again.');
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const getHintText = (): string => {
    if (role === UserRoles.STUDENTS) {
      return 'Enter your 7-10 digit student number';
    }
    if (role === UserRoles.TEACHERS) {
      return 'Enter your alphanumeric employee number';
    }
    return 'Enter your identification number';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center">
            <BadgeCheck className="w-8 h-8 text-sky-700 dark:text-sky-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Enter Your {getIdentificationLabel(role)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We need to verify your identity before proceeding
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {getIdentificationLabel(role)}
          </label>
          <Input
            type="text"
            placeholder={getHintText()}
            value={identificationNumber}
            onChange={(e) => {
              onChangeId(e.target.value);
              setIsValid(false);
              setValidationError(null);
            }}
            error={!!validationError}
            success={isValid}
            hint={validationError || ''}
            autoFocus
          />
        </div>

        <button
          onClick={handleValidate}
          disabled={!identificationNumber || isValidating || isValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isValid
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-sky-700 text-white hover:bg-sky-800 disabled:bg-gray-300 disabled:cursor-not-allowed'
          }`}
        >
          {isValidating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Validating...
            </span>
          ) : isValid ? (
            <span className="flex items-center justify-center gap-2">
              <BadgeCheck className="w-4 h-4" />
              Verified - Click Next to Continue
            </span>
          ) : (
            'Validate Identification Number'
          )}
        </button>

        {validationError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
          </div>
        )}

        {isValid && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex items-start gap-2">
            <BadgeCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Identification verified successfully!
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
          <strong>Note:</strong> Your identification number must be validated before you can proceed to the next step.
        </p>
      </div>
    </div>
  );
};

export default IdentificationStep;
