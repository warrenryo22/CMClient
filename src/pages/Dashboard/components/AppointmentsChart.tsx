import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/card/Card";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import LoadingOverlay from "@/components/loadings/LoadingOverlay";
import { UseAppointmentChartReturn } from "../hooks/useAppointmentChartData";
import { AppointmentStatus } from "@/enums/commons";

interface AppointmentsChartProps {
  appointmentData: UseAppointmentChartReturn;
}

// Assign fixed colors per status
const STATUS_COLORS: Record<keyof typeof AppointmentStatus, string> = {
  PENDING: "#FACC15",
  APPROVED: "#22C55E",
  RESCHEDULED: "#3B82F6",
  CANCELLED: "#EF4444",
  COMPLETED: "#10B981",
  NO_SHOW: "#F97316",
  REASSIGN: "#8B5CF6",
  CHECKUP_DONE: "#14B8A6",
};

// Helper to safely map numeric enum to key
function getStatusKey(value: number): keyof typeof AppointmentStatus {
  const key = AppointmentStatus[
    value
  ] as unknown as keyof typeof AppointmentStatus;
  return key;
}

const AppointmentsChart = ({ appointmentData }: AppointmentsChartProps) => {
  const chartData = appointmentData.salesLineChartData;

  const series =
    chartData?.Series.map((s) => {
      const statusKey = getStatusKey(Number(s.name));
      return {
        ...s,
        name: statusKey, // now properly typed
      };
    }) ?? [];

  const colors = series.map(
    (s) => STATUS_COLORS[s.name] ?? "#0EA5E9", // fallback
  );

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "45%", borderRadius: 6 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData?.Labels,
      labels: { style: { colors: "#667085", fontSize: "12px" }, rotate: -45 },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#667085", fontSize: "12px" },
        formatter: (v) => Math.round(v).toString(),
      },
    },
    grid: { borderColor: "#e4e7ec", strokeDashArray: 4 },
    tooltip: { theme: "light", y: { formatter: (v) => `${v} appointments` } },
    legend: { position: "top", horizontalAlign: "right" },
    colors,
  };

  return (
    <Card className="relative border-gray-200 dark:border-gray-800">
      <LoadingOverlay isLoading={appointmentData.isLoading} size={24} />
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Appointments by Status
        </CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default AppointmentsChart;
