import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/card/Card";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TrendingUp } from "lucide-react";
import { useAppointmentDistributionTrendData } from "../hooks/useAppointmentDistributionTrendData";
import PeriodFilter from "@/components/common/PeriodFilter";
import DatePicker from "@/components/input/DatePicker";
import { useEffect, useState } from "react";
import { FilterTimeIntervals } from "@/enums/commons";
import LoadingOverlay from "@/components/loadings/LoadingOverlay";

const AppointmentReasonsTrend = () => {
  const reasonTrend = useAppointmentDistributionTrendData();
  const [dateRange, setDateRange] = useState<Date | [Date, Date] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterTimeIntervals>(
    FilterTimeIntervals.MONTHLY,
  );
  const chartData = reasonTrend.salesLineChartData.result ?? [];

  const reasonNames =
    chartData.length > 0 && chartData[0].reasons
      ? Object.keys(chartData[0].reasons)
      : [];

  const series = reasonNames.map((reason) => ({
    name: reason,
    data: chartData.map((week) => Math.round(week.reasons?.[reason] ?? 0)),
  }));

  useEffect(() => {
    reasonTrend.setDateRange(dateRange);
    reasonTrend.setTimeInterval(selectedPeriod);
  }, [selectedPeriod, dateRange]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    stroke: { width: 3, curve: "smooth" },
    xaxis: {
      categories: chartData.map((item) => item.date),
      labels: { style: { colors: "#667085", fontSize: "12px" } },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#667085", fontSize: "12px" },
        formatter: (value) => Math.round(value).toString(),
      },
      title: {
        text: "Number of Visits",
        style: { fontSize: "12px", fontWeight: 600, color: "#667085" },
      },
    },
    grid: { borderColor: "#e4e7ec", strokeDashArray: 4 },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px" },
    colors: [
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
    ],
    tooltip: { theme: "light", y: { formatter: (value) => `${value} visits` } },
    markers: { size: 4, strokeWidth: 2, hover: { size: 6 } },
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 relative">
      {reasonTrend.isLoading && (
        <LoadingOverlay isLoading={reasonTrend.isLoading} size={24}/>
      )}
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Appointment Reasons Trend
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-between mt-4">
          <PeriodFilter
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={(value) => {
              setDateRange(null);
              setSelectedPeriod(value);
            }}
            loading={false}
          />
          <DatePicker
            id="attendance-date"
            mode="range"
            value={dateRange}
            onChange={(value) => {
              setDateRange(value);
            }}
            placeholder="Select a date"
            className="min-w-[245px] pr-12 bg-white dark:bg-white/[0.03]"
          />
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>AI Insight:</strong> {reasonTrend.salesLineChartData.aiInsight}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentReasonsTrend;
