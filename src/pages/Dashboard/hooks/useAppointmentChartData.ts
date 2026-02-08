
import { FilterTimeIntervals } from "@/enums/commons";
import { dashboardService } from "@/services/dashboardService";
import { AppointmentChartDataDTO, DashboardFilterDTO } from "@/types/dashboardTypes";
import { useEffect, useState } from "react";

export function useAppointmentChartData() {
    const [timeInterval, setTimeInterval] = useState<FilterTimeIntervals>(FilterTimeIntervals.MONTHLY);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [salesLineChartData, setSalesLineChartData] = useState<AppointmentChartDataDTO>();

    const fetchGrossExpenseData = async () => {
        setIsLoading(true);
        const payload = new DashboardFilterDTO();
        payload.FilterTimeIntervals = timeInterval;
        if (dateRange) {
            payload.StartDate = dateRange[0];
            payload.EndDate = dateRange[1];
        }

        const response = await dashboardService.GetAppointmentChartData(payload);
        setSalesLineChartData(response);
        setIsLoading(false);
    }

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
        isLoading
    }
}

export type UseAppointmentChartReturn = ReturnType<typeof useAppointmentChartData>;