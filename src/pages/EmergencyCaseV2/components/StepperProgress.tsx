import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepperProgressProps {
  steps: Step[];
  currentStep: number;
}

const StepperProgress: React.FC<StepperProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-sky-600 text-white"
                        : isCurrent
                        ? "bg-sky-100 text-sky-700 ring-4 ring-sky-100"
                        : "bg-gray-100 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? <Check size={20} /> : step.number}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      isCurrent ? "text-sky-700" : isCompleted ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                </div>
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 mx-4 -mt-10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? "bg-sky-600" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperProgress;
