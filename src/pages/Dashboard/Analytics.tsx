import { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import StatCard from "./components/StatCard";
import InventoryCostChart from "./components/InventoryCostChart";
import AppointmentsChart from "./components/AppointmentsChart";
import { Package, Bell, FileText, CalendarCheck } from "lucide-react";
import SpinLoading from "@/components/loadings/SpinLoading";
import { useInventoryCostData } from "./hooks/useInventoryCostData";
import { FilterTimeIntervals } from "@/enums/commons";
import { useAppointmentChartData } from "./hooks/useAppointmentChartData";
import PeriodFilter from "@/components/common/PeriodFilter";
import { useDashboardCountData } from "./hooks/useDashboardCountData";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterTimeIntervals>(
    FilterTimeIntervals.MONTHLY,
  );
  const loading = false;

  const inventoryTrend = useInventoryCostData();
  const appointmentData = useAppointmentChartData();
  const dashCard = useDashboardCountData();

  useEffect(() => {
    inventoryTrend.setTimeInterval(selectedPeriod);
    appointmentData.setTimeInterval(selectedPeriod);
    dashCard.setTimeInterval(selectedPeriod);
  }, [selectedPeriod]);

  // Helper function to determine if trend is positive
  const getTrendProps = (
    trend?: "up" | "down" | "stable",
    percentage?: number,
  ) => {
    if (!trend || trend === "stable" || !percentage) return undefined;

    return {
      value: percentage,
      isPositive: trend === "up",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PageMeta
        title="CMS | Dashboard Analytics"
        description="Clinic Management System Dashboard"
      />

      <div className="mb-6">
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          loading={loading}
        />
      </div>
      <div className="relative h-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/60">
            <SpinLoading size={24} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Appointments"
            value={dashCard.salesLineChartData?.appointments?.count || 0}
            icon={<CalendarCheck className="w-6 h-6" />}
            iconBgColor="bg-success-100 dark:bg-success-900/30"
            iconColor="text-success-600 dark:text-success-400"
            trend={getTrendProps(
              dashCard.salesLineChartData?.appointments?.trend,
              dashCard.salesLineChartData?.appointments?.trendPercentage,
            )}
            subtitle="Total appointments"
          />

          <StatCard
            title="Total Products"
            value={dashCard.salesLineChartData?.products?.count || 0}
            icon={<Package className="w-6 h-6" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            trend={getTrendProps(
              dashCard.salesLineChartData?.products?.trend,
              dashCard.salesLineChartData?.products?.trendPercentage,
            )}
            subtitle="Products in inventory"
          />

          <StatCard
            title="Stock Alerts"
            value={dashCard.salesLineChartData?.stockAlerts?.count || 0}
            icon={<Bell className="w-6 h-6" />}
            iconBgColor="bg-warning-100 dark:bg-warning-900/30"
            iconColor="text-warning-600 dark:text-warning-400"
            trend={getTrendProps(
              dashCard.salesLineChartData?.stockAlerts?.trend,
              dashCard.salesLineChartData?.stockAlerts?.trendPercentage,
            )}
            subtitle="Items below minimum quantity"
          />

          <StatCard
            title="Medical Records"
            value={dashCard.salesLineChartData?.medicalRecords?.count || 0}
            icon={<FileText className="w-6 h-6" />}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            trend={getTrendProps(
              dashCard.salesLineChartData?.medicalRecords?.trend,
              dashCard.salesLineChartData?.medicalRecords?.trendPercentage,
            )}
            subtitle="Total patient records"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InventoryCostChart inventoryTrend={inventoryTrend} />
        <AppointmentsChart appointmentData={appointmentData} />
      </div>
    </div>
  );
};

export default Analytics;
