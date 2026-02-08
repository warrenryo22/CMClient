import { AppointmentReasons } from '@/enums/commons';
import { getAppointmentReasonLabel } from '../utils';
import TextArea from '@/components/input/TextArea';
import { 
  Thermometer, 
  Brain, 
  HeartPulse, 
  Bandage, 
  Wind, 
  Pill,
  Activity,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';

interface AppointmentReasonStepProps {
  selectedReason: AppointmentReasons | null;
  otherReason: string;
  onSelectReason: (reason: AppointmentReasons) => void;
  onChangeOtherReason: (value: string) => void;
}

const AppointmentReasonStep = ({
  selectedReason,
  otherReason,
  onSelectReason,
  onChangeOtherReason,
}: AppointmentReasonStepProps) => {
  const getReasonIcon = (reason: AppointmentReasons) => {
    switch (reason) {
      case AppointmentReasons.FEVER_OR_FLU_LIKE_SYMPTOMS:
        return <Thermometer className="w-5 h-5" />;
      case AppointmentReasons.HEADACHE_OR_MIGRAINE:
        return <Brain className="w-5 h-5" />;
      case AppointmentReasons.STOMACHACHE_OR_DIGESTIVE_PROBLEMS:
        return <HeartPulse className="w-5 h-5" />;
      case AppointmentReasons.MINOR_INJURY_OR_ACCIDENT:
        return <Bandage className="w-5 h-5" />;
      case AppointmentReasons.ALLERGY_OR_ASTHMA_RELATED_SYMPTOMS:
        return <Wind className="w-5 h-5" />;
      case AppointmentReasons.DENTAL_PAIN_OR_ORAL_HEALTH_CONCERNS:
        return <Pill className="w-5 h-5" />;
      case AppointmentReasons.SKIN_CONDITIONS_OR_RASHES:
        return <Activity className="w-5 h-5" />;
      case AppointmentReasons.FOLLOW_UP_CHECK_UP:
        return <CalendarCheck className="w-5 h-5" />;
      case AppointmentReasons.OTHER_HEALTH_CONCERNS:
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const reasons = Object.values(AppointmentReasons).filter(
    (value) => typeof value === 'number'
  ) as AppointmentReasons[];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Reason for Visit
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the reason that best describes your visit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {reasons.map((reason) => {
          const isSelected = selectedReason === reason;
          return (
            <button
              key={reason}
              onClick={() => onSelectReason(reason)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-sky-700 bg-sky-50 dark:bg-sky-950/30 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sky-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-sky-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {getReasonIcon(reason)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isSelected
                        ? 'text-sky-900 dark:text-sky-300'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {getAppointmentReasonLabel(reason)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedReason === AppointmentReasons.OTHER_HEALTH_CONCERNS && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Please describe your concern <span className="text-red-500">*</span>
          </label>
          <TextArea
            placeholder="Describe your health concern in detail..."
            value={otherReason}
            onChange={(value) => onChangeOtherReason(value)}
            rows={4}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Please provide as much detail as possible to help us serve you better.
          </p>
        </div>
      )}

      {selectedReason !== null && selectedReason !== AppointmentReasons.OTHER_HEALTH_CONCERNS && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300 text-center">
            <strong>Selected:</strong> {getAppointmentReasonLabel(selectedReason)} - Click "Submit" to complete registration
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentReasonStep;
