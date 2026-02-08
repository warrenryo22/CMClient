import api from "@/api/axios";
import {
  AISummaryReportDTO,
  AppointmentAnalyticsDTO,
  AppointmentChartDataDTO,
  AppointmentReasonDataDTO,
  AppointmentReasonTrendDTO,
  DashboardFilterDTO,
  DashboardMetricDTO,
  DashCardDTO,
  InventoryCostAnalyticsDTO,
  InventoryCostTrendDataDTO,
} from "@/types/dashboardTypes";
import { handleError } from "@/utilities/helpers";
import successModalInstance from "@/utilities/successModalInstance";

class DashboardService {
  async GetDashCard(
    filter: "daily" | "weekly" | "monthly" | "yearly" = "daily",
  ): Promise<DashCardDTO> {
    try {
      const response = await api.get("dashboard/get-dashboard-card", {
        params: { filter },
      });
      return new DashCardDTO(response.data.Data);
    } catch (error) {
      console.error("Error fetching dashboard cards:", error);
      return new DashCardDTO();
    }
  }

  async GetAppointmentAnalytics(
    filter: "daily" | "weekly" | "monthly" | "yearly" = "monthly",
  ): Promise<AppointmentAnalyticsDTO> {
    try {
      const response = await api.get("dashboard/get-appointment-analytics", {
        params: { filter },
      });

      const data = response.data.Data;

      // Transform the data to convert string numbers to actual numbers
      const transformedData: AppointmentAnalyticsDTO = {
        ...data,
        chart_data: data.chart_data.map((item: any) => ({
          ...item,
          completed: Number(item.completed) || 0,
          cancelled: Number(item.cancelled) || 0,
          pending: Number(item.pending) || 0,
        })),
        summary: {
          ...data.summary,
          completed: Number(data.summary.completed) || 0,
          cancelled: Number(data.summary.cancelled) || 0,
          pending: Number(data.summary.pending) || 0,
        },
      };

      return transformedData;
    } catch (error) {
      console.error("Error fetching appointment analytics:", error);
      return {
        filter: filter,
        date_range: { start: "", end: "" },
        chart_data: [],
        status_breakdown: [],
        type_breakdown: [],
        summary: {
          total: 0,
          completed: 0,
          cancelled: 0,
          pending: 0,
          percentage_change: 0,
          previous_period_count: 0,
        },
      };
    }
  }

  async GetInventoryCostAnalytics(
    filter: "daily" | "weekly" | "monthly" | "yearly" = "monthly",
  ): Promise<InventoryCostAnalyticsDTO> {
    try {
      const response = await api.get("dashboard/get-inventory-cost-analytics", {
        params: { filter },
      });
      return response.data.Data;
    } catch (error) {
      console.error("Error fetching inventory cost analytics:", error);
      return {
        filter: filter,
        date_range: { start: "", end: "" },
        chart_data: [],
        summary: {
          current_period_cost: "0.00",
          previous_period_cost: "0.00",
          percentage_change: 0,
          current_inventory_value: "0.00",
          total_purchase_orders: 0,
          average_purchase_order_value: "0.00",
        },
        top_products: [],
      };
    }
  }

  async GetInventoryCostTrend(
    payload: DashboardFilterDTO,
  ): Promise<InventoryCostTrendDataDTO> {
    try {
      const response = await api.get("dashboard/get-inventory-cost-analytics", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new InventoryCostTrendDataDTO();
    }
  }

  async GetAppointmentChartData(
    payload: DashboardFilterDTO,
  ): Promise<AppointmentChartDataDTO> {
    try {
      const response = await api.get("dashboard/get-appointment-analytics", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new AppointmentChartDataDTO();
    }
  }

  async GenerateAISummary(
    payload: DashboardFilterDTO,
  ): Promise<AISummaryReportDTO | null> {
    try {
      const response = await api.post("dashboard/generate-summary", payload);
      if (response.data.Data.ai_id) {
        successModalInstance.show({
          message: `AI Created ${response.data.Data.title}`,
        });
        return response.data.Data;
      }
      return null;
    } catch (error) {
      handleError(error);
      return null;
    }
  }

  async GetLatestAISummary(): Promise<AISummaryReportDTO> {
    try {
      const response = await api.get("dashboard/get-latest-summary");
      return response.data.Data;
    } catch (error) {
      return new AISummaryReportDTO();
    }
  }

  async GetAppointmentReasonDistribution(
    payload: DashboardFilterDTO,
  ): Promise<AppointmentReasonDataDTO[]> {
    try {
      const response = await api.get(
        "dashboard/get-appointment-reason-distribution",
        {
          params: payload,
        },
      );
      return response.data.Data;
    } catch (error) {
      return [];
    }
  }

  async GetAppointmentDistributionReasonTrend(
    payload: DashboardFilterDTO,
  ): Promise<AppointmentReasonTrendDTO> {
    try {
      const response = await api.get("dashboard/get-appointment-reason-trend", {
        params: payload,
      });
      return response.data.Data;
    } catch (error) {
      return new AppointmentReasonTrendDTO();
    }
  }

  async GetDashboardCounts(
    payload: DashboardFilterDTO,
  ): Promise<DashboardMetricDTO> {
    try {
      const response = await api.get("dashboard/get-dashboard-count", {
        params: payload,
      });

      return response.data.Data;
    } catch (error) {
      return new DashboardMetricDTO();
    }
  }
}

export const dashboardService = new DashboardService();
