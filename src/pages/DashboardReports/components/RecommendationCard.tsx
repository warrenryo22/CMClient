import { Card, CardContent } from '@/components/card/Card';
import Badge from '@/components/badge/Badge';
import { Recommendation } from '../types';
import { Lightbulb, AlertCircle } from 'lucide-react';
import { BadgeColor } from '@/components/badge/Badge';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const getPriorityColor = (
    priority: Recommendation['priority'],
  ): BadgeColor => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getPriorityBg = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-error-50 dark:bg-error-950/20';
      case 'medium':
        return 'bg-warning-50 dark:bg-warning-950/20';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 hover:shadow-theme-md transition-all duration-200">
      <CardContent className="py-4">
        <div className="flex gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg ${getPriorityBg(recommendation.priority)} flex items-center justify-center`}
          >
            {recommendation.priority === 'high' ? (
              <AlertCircle className="w-5 h-5 text-error-600" />
            ) : (
              <Lightbulb className="w-5 h-5 text-warning-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {recommendation.title}
              </h4>
              <Badge size="sm" color={getPriorityColor(recommendation.priority)}>
                {recommendation.priority.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
              {recommendation.description}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                {recommendation.category}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <strong className="text-gray-700 dark:text-gray-300">
                  Expected Impact:
                </strong>{' '}
                {recommendation.impact}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
