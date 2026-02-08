export type PeriodFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DashboardMetrics {
  inventoryCost: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  appointments: {
    today: number;
    total: number;
    percentageChange: number;
  };
  products: {
    total: number;
    lowStock: number;
  };
  stockAlerts: {
    critical: number;
    warning: number;
  };
  medicalRecords: {
    total: number;
    thisMonth: number;
  };
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AppointmentItem {
  id: number;
  patientName: string;
  time: string;
  reason: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface LowStockItem {
  id: number;
  productName: string;
  currentStock: number;
  minStock: number;
  urgency: 'critical' | 'warning';
}
