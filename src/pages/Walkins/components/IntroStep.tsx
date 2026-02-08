import { ClipboardPlus, ArrowRight } from 'lucide-react';
import Button from '@/components/buttons/Button';

interface IntroStepProps {
  onNext: () => void;
}

const IntroStep = ({ onNext }: IntroStepProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center">
          <ClipboardPlus className="w-10 h-10 text-sky-700 dark:text-sky-400" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to Walk-In Registration
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
        Register your visit quickly and efficiently. This process will only take a few minutes.
      </p>

      <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          You will need:
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-sky-700 dark:text-sky-400 mt-1">•</span>
            <span>Your identification number (Student No. or Employee No.) or personal details if you're a visitor</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sky-700 dark:text-sky-400 mt-1">•</span>
            <span>Information about your reason for visiting the clinic</span>
          </li>
        </ul>
      </div>

      <Button onClick={onNext} size="md" endIcon={<ArrowRight className="w-4 h-4" />}>
        Start Registration
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
        Your information is kept confidential and secure
      </p>
    </div>
  );
};

export default IntroStep;
