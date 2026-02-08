import { FilterTimeIntervals } from "@/enums/commons";
import { dashboardService } from "@/services/dashboardService";
import {
  AppointmentReasonDataDTO,
  DashboardFilterDTO,
} from "@/types/dashboardTypes";
import { useEffect, useState } from "react";

export function useAppointmentDistributionData() {
  const [timeInterval, setTimeInterval] = useState<FilterTimeIntervals>(
    FilterTimeIntervals.MONTHLY,
  );
  const [dateRange, setDateRange] = useState<Date | [Date, Date] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [salesLineChartData, setSalesLineChartData] = useState<
    AppointmentReasonDataDTO[]
  >([]);

  const fetchGrossExpenseData = async () => {
    setIsLoading(true);
    const payload = new DashboardFilterDTO();
    payload.FilterTimeIntervals = timeInterval;
    if (Array.isArray(dateRange)) {
      payload.StartDate = dateRange[0];
      payload.EndDate = dateRange[1];
    }

    const response =
      await dashboardService.GetAppointmentReasonDistribution(payload);
    setSalesLineChartData(response);
    setIsLoading(false);
  };

  const fetchAll = async () => {
    await Promise.all([fetchGrossExpenseData()]);
  };

  useEffect(() => {
    fetchAll();
  }, [timeInterval, dateRange]);

  return {
    timeInterval,
    setTimeInterval,
    dateRange,
    setDateRange,
    salesLineChartData,
    isLoading,
  };
}

export type UseInventoryTrendReturn = ReturnType<
  typeof useAppointmentDistributionData
>;
