
import { FilterTimeIntervals } from "@/enums/commons";
import { dashboardService } from "@/services/dashboardService";
import { DashboardFilterDTO, InventoryCostTrendDataDTO } from "@/types/dashboardTypes";
import { useEffect, useState } from "react";

export function useInventoryCostData() {
    const [timeInterval, setTimeInterval] = useState<FilterTimeIntervals>(FilterTimeIntervals.MONTHLY);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [salesLineChartData, setSalesLineChartData] = useState<InventoryCostTrendDataDTO>();

    const fetchGrossExpenseData = async () => {
        setIsLoading(true);
        const payload = new DashboardFilterDTO();
        payload.FilterTimeIntervals = timeInterval;
        if (dateRange) {
            payload.StartDate = dateRange[0];
            payload.EndDate = dateRange[1];
        }

        const response = await dashboardService.GetInventoryCostTrend(payload);
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

export type UseInventoryTrendReturn = ReturnType<typeof useInventoryCostData>;