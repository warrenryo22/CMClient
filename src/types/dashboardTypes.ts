import { ApprovalStatus, FilterTimeIntervals } from "@/enums/commons";

export class DashCardDTO {
  filter: string = "";
  date_range: { start: string; end: string } = { start: "", end: "" };
  cards: {
    total_inventory_cost: {
      total: string;
      filtered_period: string;
      current_value: string;
      cost_of_items_used: string;
      items_added_count: number;
      total_items_added: number;
      percentage_change: number;
      label: string;
    };
    appointments: {
      count: number;
      by_status: Record<string, number>;
      by_type: Record<string, number>;
      average_per_day: number;
      label: string;
    };
    total_products: {
      total: number;
      new_in_period: number;
      label: string;
    };
    stock_alerts: {
      total_alerts: number;
      out_of_stock: number;
      low_stock: number;
      products: Array<{
        id: number;
        title: string;
        quantity: number;
        reflenish_amount: number;
        at_cost: string;
        uom: string;
        status: "out_of_stock" | "low_stock";
        shortage: number;
      }>;
      label: string;
    };
    medical_records: {
      total: number;
      completed: number;
      pending: number;
      completion_rate: number;
      label: string;
    };
    total_appointments: {
      all_time: number;
      filtered_period: number;
      label: string;
    };
    inventory_activity: {
      items_used: number;
      cost_of_items_used: string;
      label: string;
    };
  } = {
    total_inventory_cost: {
      total: "0.00",
      filtered_period: "0.00",
      current_value: "0.00",
      cost_of_items_used: "0.00",
      items_added_count: 0,
      total_items_added: 0,
      percentage_change: 0,
      label: "",
    },
    appointments: {
      count: 0,
      by_status: {},
      by_type: {},
      average_per_day: 0,
      label: "",
    },
    total_products: {
      total: 0,
      new_in_period: 0,
      label: "",
    },
    stock_alerts: {
      total_alerts: 0,
      out_of_stock: 0,
      low_stock: 0,
      products: [],
      label: "",
    },
    medical_records: {
      total: 0,
      completed: 0,
      pending: 0,
      completion_rate: 0,
      label: "",
    },
    total_appointments: {
      all_time: 0,
      filtered_period: 0,
      label: "",
    },
    inventory_activity: {
      items_used: 0,
      cost_of_items_used: "0.00",
      label: "",
    },
  };

  constructor(init?: Partial<DashCardDTO>) {
    Object.assign(this, init);
  }
}
export class AppointedDoctorDTO {
  Id: number = 0;
  DoctorId: number = 0;
  FullName: string = "";
  Status: ApprovalStatus = ApprovalStatus.APPROVED;
  Reason: string = "";

  constructor(init?: Partial<AppointedDoctorDTO>) {
    return Object.assign(this, init);
  }
}

export interface AppointmentChartData {
  period: string;
  label: string;
  count: number;
  completed: number; // Keep as number in your app
  cancelled: number; // Keep as number in your app
  pending: number; // Keep as number in your app
  date?: string;
  month?: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  label: string;
}

export interface TypeBreakdown {
  type: string;
  count: number;
  label: string;
}

export interface AppointmentSummary {
  total: number;
  completed: number; // Keep as number in your app
  cancelled: number; // Keep as number in your app
  pending: number; // Keep as number in your app
  percentage_change: number;
  previous_period_count: number;
}

export interface AppointmentAnalyticsDTO {
  filter: string;
  date_range: {
    start: string;
    end: string;
  };
  chart_data: AppointmentChartData[];
  status_breakdown: StatusBreakdown[];
  type_breakdown: TypeBreakdown[];
  summary: AppointmentSummary;
}

export interface InventoryCostChartData {
  period: string;
  label: string;
  cost: number;
  cumulative_cost: number;
  purchase_count: number;
  total_items: number;
  date?: string;
  month?: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  quantity: number;
  total_cost: string;
  uom: string;
}

export interface InventoryCostSummary {
  current_period_cost: string;
  previous_period_cost: string;
  percentage_change: number;
  current_inventory_value: string;
  total_purchase_orders: number;
  average_purchase_order_value: string;
}

export interface InventoryCostAnalyticsDTO {
  filter: string;
  date_range: {
    start: string;
    end: string;
  };
  chart_data: InventoryCostChartData[];
  summary: InventoryCostSummary;
  top_products: TopProduct[];
}

export class DashboardFilterDTO {
  FilterTimeIntervals: FilterTimeIntervals = FilterTimeIntervals.DAILY;
  DateTime: Date | null = null;
  StartDate: Date | null = null;
  EndDate: Date | null = null;
  BranchUniqueId?: string | null;

  constructor(init?: Partial<DashboardFilterDTO>) {
    return Object.assign(this, init);
  }
}

export class InventoryCostTrendDataDTO {
  Labels: string[] = [];
  Series: Array<{
    name: string;
    data: number[];
  }> = [];
  Total: number = 0;
  ChangePercentage: number = 0;

  constructor(init?: Partial<InventoryCostTrendDataDTO>) {
    Object.assign(this, init);
  }
}

export class AppointmentChartDataDTO {
  Labels: string[] = [];
  Series: Array<{
    name: string;
    data: number[];
  }> = [];
  constructor(init?: Partial<AppointmentChartDataDTO>) {
    Object.assign(this, init);
  }
}

export class AISummaryReportDTO {
  ai_id: string = "";
  title: string = "";
  summary: string = "";
  insights: string[] = [];
  confidence: number = 0; // 0-100
  created_at: Date = new Date();

  constructor(init?: Partial<AISummaryReportDTO>) {
    Object.assign(this, init);
  }
}

export class AppointmentReasonDataDTO {
  reason: string = "";
  count: number = 0;
  percentage: number = 0;
  trend: "up" | "down" | "stable" = "stable";
  trendPercentage: number = 0;

  constructor(init?: Partial<AppointmentReasonDataDTO>) {
    Object.assign(this, init);
  }
}

export class AppointmentReasonTrendDTO {
  result: AppointmentReasonTrendDataDTO[] = [];
  aiInsight: string = '';

  constructor(init?: Partial<AppointmentReasonDataDTO>) {
    Object.assign(this, init);
  }
}

export class AppointmentReasonTrendDataDTO{
  date: string = "";
  reasons?: Record<string, number>;

  constructor(init?: Partial<AppointmentReasonTrendDataDTO>) {
    Object.assign(this, init);
  }
}

export class DashboardMetricDTO {
  appointments: {
    count: number;
    trend: "up" | "down" | "stable";
    trendPercentage: number;
  } = {
    count: 0,
    trend: "stable",
    trendPercentage: 0,
  };

  products: {
    count: number;
    trend: "up" | "down" | "stable";
    trendPercentage: number;
  } = {
    count: 0,
    trend: "stable",
    trendPercentage: 0,
  };

  stockAlerts: {
    count: number;
    trend: "up" | "down" | "stable";
    trendPercentage: number;
  } = {
    count: 0,
    trend: "stable",
    trendPercentage: 0,
  };

  medicalRecords: {
    count: number;
    trend: "up" | "down" | "stable";
    trendPercentage: number;
  } = {
    count: 0,
    trend: "stable",
    trendPercentage: 0,
  };

  constructor(init?: Partial<DashboardMetricDTO>) {
    Object.assign(this, init);
  }
}