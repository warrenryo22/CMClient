import { useEffect, useState } from 'react';
import { Brain, Database, TrendingUp, Lightbulb, FileText, CheckCircle } from 'lucide-react';

interface GenerationStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  duration: number;
}

const generationSteps: GenerationStep[] = [
  {
    id: 1,
    label: 'Analyzing appointment data...',
    icon: <Database className="w-5 h-5" />,
    duration: 800,
  },
  {
    id: 2,
    label: 'Processing medical records...',
    icon: <FileText className="w-5 h-5" />,
    duration: 900,
  },
  {
    id: 3,
    label: 'Identifying patterns and trends...',
    icon: <TrendingUp className="w-5 h-5" />,
    duration: 1000,
  },
  {
    id: 4,
    label: 'Generating AI insights...',
    icon: <Brain className="w-5 h-5" />,
    duration: 1100,
  },
  {
    id: 5,
    label: 'Compiling executive summary...',
    icon: <Lightbulb className="w-5 h-5" />,
    duration: 800,
  },
];

interface AIGenerationSimulationProps {
  isGenerating: boolean;
}

const AIGenerationSimulation = ({ isGenerating }: AIGenerationSimulationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let totalDuration = 0;

    const runSteps = () => {
      if (stepIndex < generationSteps.length) {
        const step = generationSteps[stepIndex];
        setCurrentStep(step.id);
        totalDuration += step.duration;

        // Animate progress for current step
        const startProgress = (stepIndex / generationSteps.length) * 100;
        const endProgress = ((stepIndex + 1) / generationSteps.length) * 100;
        const progressIncrement = (endProgress - startProgress) / (step.duration / 50);
        
        let currentProgress = startProgress;
        const progressInterval = setInterval(() => {
          currentProgress += progressIncrement;
          if (currentProgress >= endProgress) {
            currentProgress = endProgress;
            clearInterval(progressInterval);
          }
          setProgress(currentProgress);
        }, 50);

        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, step.id]);
          stepIndex++;
          runSteps();
        }, step.duration);
      }
    };

    runSteps();

    return () => {
      setCurrentStep(0);
      setCompletedSteps([]);
      setProgress(0);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI is Generating Your Report
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This may take a few moments...
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Generation Steps */}
      <div className="space-y-3 py-2">
        {generationSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isCompleted
                  ? 'bg-success-50 dark:bg-success-950/20 border border-success-200 dark:border-success-900'
                  : isCurrent
                    ? 'bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900'
                    : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-50'
              }`}
            >
              <div
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
                    : isCurrent
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isCompleted
                      ? 'text-success-700 dark:text-success-400'
                      : isCurrent
                        ? 'text-purple-700 dark:text-purple-300'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {isCurrent && (
                <div className="flex-shrink-0">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Info Footer */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          <strong className="text-purple-600 dark:text-purple-400">AI Tip:</strong>{' '}
          Our advanced algorithms analyze thousands of data points to provide you with actionable insights
        </p>
      </div>
    </div>
  );
};

export default AIGenerationSimulation;
