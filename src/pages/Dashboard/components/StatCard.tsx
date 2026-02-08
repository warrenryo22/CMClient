import { Card, CardContent } from '@/components/card/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-sky-100',
  iconColor = 'text-sky-700',
  trend,
  subtitle,
  onClick,
}: StatCardProps) => {
  return (
    <Card
      className={`border-gray-200 dark:border-gray-800 hover:shadow-theme-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </h3>
              {trend && (
                <span
                  className={`inline-flex items-center gap-1 text-sm font-medium ${
                    trend.isPositive
                      ? 'text-success-600'
                      : 'text-error-600'
                  }`}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBgColor}`}
          >
            <div className={`w-6 h-6 ${iconColor}`}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
