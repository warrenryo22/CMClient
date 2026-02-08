import { Card, CardHeader, CardTitle, CardContent } from '@/components/card/Card';
import { MedicalRecordInsight } from '../types';
import {
  ClipboardCheck,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';

interface MedicalRecordsInsightsProps {
  insights: MedicalRecordInsight[];
}

const MedicalRecordsInsights = ({ insights }: MedicalRecordsInsightsProps) => {
  const getSeverityIcon = (severity: MedicalRecordInsight['severity']) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityBg = (severity: MedicalRecordInsight['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-success-50 dark:bg-success-950/30 border-success-200 dark:border-success-900';
      case 'warning':
        return 'bg-warning-50 dark:bg-warning-950/30 border-warning-200 dark:border-warning-900';
      default:
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900';
    }
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Medical Records Insights
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSeverityBg(insight.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(insight.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {insight.metric}
                    </h4>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {insight.value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {insight.insight}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
          <h5 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
            AI Summary
          </h5>
          <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
            Overall medical record management shows strong performance with
            excellent completion rates and prescription accuracy. The slight
            increase in referral rates warrants monitoring but remains within
            acceptable ranges. Continue current protocols while tracking digital
            adoption progress toward the 95% target.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsInsights;
