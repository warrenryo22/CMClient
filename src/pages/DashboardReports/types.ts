export interface AIReport {
  id: string;
  title: string;
  summary: string;
  insights: string[];
  confidence: number; // 0-100
  generatedAt: Date;
}

export interface AppointmentReasonData {
  reason: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface AppointmentReasonTrend {
  date: string;
  reasons: Record<string, number>;
}

export interface MedicalRecordInsight {
  metric: string;
  value: string | number;
  insight: string;
  severity: 'info' | 'warning' | 'success';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  impact: string;
}
