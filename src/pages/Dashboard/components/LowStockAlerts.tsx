import { Card, CardHeader, CardTitle, CardContent } from '@/components/card/Card';
import Badge from '@/components/badge/Badge';
import { LowStockItem } from '../types';
import { Package, AlertTriangle } from 'lucide-react';
import { BadgeColor } from '@/components/badge/Badge';

interface LowStockAlertsProps {
  items: LowStockItem[];
}

const getUrgencyColor = (urgency: LowStockItem['urgency']): BadgeColor => {
  return urgency === 'critical' ? 'error' : 'warning';
};

const LowStockAlerts = ({ items }: LowStockAlertsProps) => {
  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Low Stock Alerts
          </CardTitle>
          {items.length > 0 && (
            <Badge color="error">{items.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-4">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No low stock items
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    item.urgency === 'critical'
                      ? 'bg-error-50'
                      : 'bg-warning-50'
                  }`}
                >
                  {item.urgency === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-error-600" />
                  ) : (
                    <Package className="w-5 h-5 text-warning-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.productName}
                    </h4>
                    <Badge color={getUrgencyColor(item.urgency)}>
                      {item.urgency}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Current: <span className="font-medium text-gray-900 dark:text-white">{item.currentStock}</span>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Min: <span className="font-medium text-gray-900 dark:text-white">{item.minStock}</span>
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        item.urgency === 'critical'
                          ? 'bg-error-500'
                          : 'bg-warning-500'
                      }`}
                      style={{
                        width: `${Math.min((item.currentStock / item.minStock) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
