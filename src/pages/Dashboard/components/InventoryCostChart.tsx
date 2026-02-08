import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/card/Card";
import { ApexOptions } from "apexcharts";
import { UseInventoryTrendReturn } from "../hooks/useInventoryCostData";
import ReactApexChart from "react-apexcharts";
import { capitalize, formatCurrencyWithPesoSign } from "@/utilities/helpers";
import { FilterTimeIntervals } from "@/enums/commons";
import Badge from "@/components/badge/Badge";
import LoadingOverlay from "@/components/loadings/LoadingOverlay";

interface InventoryCostChartProps {
  inventoryTrend: UseInventoryTrendReturn;
}

const InventoryCostChart = ({ inventoryTrend }: InventoryCostChartProps) => {
  const salesLineChartData = inventoryTrend.salesLineChartData;

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
      fontFamily: "Outfit, sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#0369a1"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
      colors: ["#0369a1"],
    },
    colors: ["#0369a1"],
    xaxis: {
      categories: salesLineChartData?.Labels,
      labels: {
        style: {
          colors: "#667085",
          fontSize: "12px",
        },
        rotate: -45,
        rotateAlways: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#667085",
          fontSize: "12px",
        },
        formatter: (value) => {
          if (value >= 1000) {
            return `₱${(value / 1000).toFixed(1)}k`;
          }
          return `₱${value.toFixed(0)}`;
        },
      },
    },
    grid: {
      borderColor: "#e4e7ec",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: (value) => {
          return `₱${value.toLocaleString()}`;
        },
      },
    },
  };

  const series: ApexAxisChartSeries = salesLineChartData?.Series ?? [];

  return (
    <Card className="relative border-gray-200 dark:border-gray-800">
      <LoadingOverlay isLoading={inventoryTrend.isLoading} size={24}/>
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Inventory Cost Trend
        </CardTitle>
        <div className="flex items-start gap-2">
          <div>
            <h4 className="text-base font-bold text-gray-800 dark:text-white/90 sm:text-theme-xl">
              {formatCurrencyWithPesoSign(salesLineChartData?.Total ?? 0)}
            </h4>
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Avg.{" "}
              {capitalize(FilterTimeIntervals[inventoryTrend.timeInterval])}{" "}
              Cost
            </span>
            {salesLineChartData && (
              <div className="flex flex-col">
                <div>
                  <Badge
                    size="sm"
                    color={
                      salesLineChartData.ChangePercentage > 0
                        ? "success"
                        : salesLineChartData.ChangePercentage < 0
                          ? "error"
                          : "warning"
                    }
                  >
                    {salesLineChartData.ChangePercentage < 0
                      ? `${salesLineChartData.ChangePercentage}`
                      : `+${salesLineChartData.ChangePercentage}`}
                    % compared last{" "}
                    {FilterTimeIntervals[inventoryTrend.timeInterval]
                      .toLocaleLowerCase()
                      .replace(/ly$/, "")}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default InventoryCostChart;
