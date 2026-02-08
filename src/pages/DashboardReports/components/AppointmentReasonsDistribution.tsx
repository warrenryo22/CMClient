import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/card/Card";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { AppointmentReasonData } from "../types";
import { PieChart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Badge from "@/components/badge/Badge";
import { useEffect, useState } from "react";
import PeriodFilter from "@/components/common/PeriodFilter";
import { FilterTimeIntervals } from "@/enums/commons";
import { useAppointmentDistributionData } from "../hooks/useAppointmentDistributionData";
import DatePicker from "@/components/input/DatePicker";
import LoadingOverlay from "@/components/loadings/LoadingOverlay";

const AppointmentReasonsDistribution = () => {
  const appointmentData = useAppointmentDistributionData();
  const [dateRange, setDateRange] = useState<Date | [Date, Date] | null>(null);
  const series = appointmentData.salesLineChartData.map((item) => item.count);
  const labels = appointmentData.salesLineChartData.map((item) => item.reason);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterTimeIntervals>(
    FilterTimeIntervals.MONTHLY,
  );

  useEffect(() => {
    appointmentData.setDateRange(dateRange);
    appointmentData.setTimeInterval(selectedPeriod);
  }, [selectedPeriod, dateRange]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    labels: labels,
    colors: [
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
      "#f97316",
      "#6366f1",
    ],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "11px",
        fontWeight: 600,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              formatter: (val) => val.toString(),
            },
            total: {
              show: true,
              label: "Total Visits",
              fontSize: "14px",
              color: "#667085",
              formatter: () => {
                return appointmentData.salesLineChartData
                  .reduce((sum, item) => sum + item.count, 0)
                  .toString();
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const percentage =
            appointmentData.salesLineChartData[opts.seriesIndex].percentage;
          return `${val} visits (${percentage}%)`;
        },
      },
    },
  };

  const getTrendIcon = (trend: AppointmentReasonData["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3" />;
      case "down":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = (trend: AppointmentReasonData["trend"]) => {
    switch (trend) {
      case "up":
        return "success";
      case "down":
        return "error";
      default:
        return "light";
    }
  };

  return (
    <Card className="relative border-gray-200 dark:border-gray-800">
      {appointmentData.isLoading && (
        <LoadingOverlay isLoading={appointmentData.isLoading} size={24} />
      )}
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Appointment Reasons Distribution
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
          type="donut"
          height={380}
        />

        {/* Trend Details */}
        <div className="mt-6 space-y-2">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Trend Analysis
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {appointmentData.salesLineChartData
              .slice(0, 6)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">
                    {item.reason}
                  </span>
                  <Badge
                    size="sm"
                    color={getTrendColor(item.trend)}
                    startIcon={getTrendIcon(item.trend)}
                  >
                    {item.trendPercentage > 0 ? "+" : ""}
                    {item.trendPercentage}%
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentReasonsDistribution;
