import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { appointmentService } from "@/services/appointmentService";
import { AppointmentStatusCount } from "@/types/appointmentTypes";
import { AppointmentStatus } from "@/enums/commons";
import { formatStatus } from "@/utilities/helpers";
import SpinLoading from "@/components/loadings/SpinLoading";

const STATUS_COLORS: Record<number, string> = {
  [AppointmentStatus.PENDING]: "bg-yellow-500",
  [AppointmentStatus.APPROVED]: "bg-green-500",
  [AppointmentStatus.RESCHEDULED]: "bg-blue-500",
  [AppointmentStatus.CANCELLED]: "bg-red-500",
  [AppointmentStatus.COMPLETED]: "bg-gray-500",
  [AppointmentStatus.NO_SHOW]: "bg-orange-500",
};

const OverallAppointmentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointmentData, setAppointmentData] = useState<
    Record<string, AppointmentStatusCount[]>
  >({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentCounts = async () => {
      setIsLoading(true);
      try {
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = String(currentDate.getFullYear());

        const response = await appointmentService.GetAppointmentCalendarCounts(
          month,
          year
        );

        // Normalize data: convert objects to arrays
        const normalizedData: Record<string, AppointmentStatusCount[]> = {};

        Object.entries(response).forEach(([date, value]) => {
          if (Array.isArray(value)) {
            normalizedData[date] = value;
          } else {
            // value is an object keyed by status
            normalizedData[date] = Object.values(value);
          }
        });

        setAppointmentData(normalizedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch appointment counts:", error);
      }
    };

    fetchAppointmentCounts();
  }, [currentDate]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysOfWeekShort = ["S", "M", "T", "W", "T", "F", "S"];

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    return { year, month, startingDayOfWeek, totalDays };
  };

  const isWeekend = (day: number): boolean => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const getAppointmentStatusCounts = (
    day: number
  ): AppointmentStatusCount[] => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;

    return appointmentData[dateStr] || [];
  };

  const getTotalAppointmentCount = (
    counts: AppointmentStatusCount[]
  ): number => {
    return counts.reduce((acc, item) => acc + item.count, 0);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");

    const selectedDate = `${year}-${month}-${date}`;
    navigate(`/appointments/${selectedDate}`);
  };

  const { startingDayOfWeek, totalDays } = getMonthData();
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="h-24 sm:h-32 bg-gray-50"></div>
    );
  }

  for (let day = 1; day <= totalDays; day++) {
    const statusCounts = getAppointmentStatusCounts(day);
    const totalCount = getTotalAppointmentCount(statusCounts);
    const today = isToday(day);

    calendarDays.push(
      <CalendarDay
        key={day}
        day={day}
        isToday={today}
        statusCounts={statusCounts}
        totalCount={totalCount}
        onClick={() => handleDateClick(day)}
        disabled={isWeekend(day)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {monthName}
        </h2>
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden relative">
        <div className="grid grid-cols-7 bg-gray-100">
          {isLoading && (
            <div className=" absolute z-10 bg-gray-50/70 h-full w-full flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center gap-2">
                <SpinLoading size={18} />
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            </div>
          )}
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{daysOfWeekShort[index]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">{calendarDays}</div>
      </div>

      <StatusLegend />
    </div>
  );
};

interface CalendarDayProps {
  day: number;
  isToday: boolean;
  statusCounts: AppointmentStatusCount[];
  totalCount: number;
  onClick: () => void;
  disabled: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isToday,
  statusCounts,
  totalCount,
  onClick,
  disabled = false,
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`h-24 sm:h-32 border border-gray-200 p-1 sm:p-2 transition-colors  
        ${isToday ? "bg-blue-100 border-blue-400" : "bg-white"}
        ${
          disabled
            ? "bg-gray-100 cursor-not-allowed opacity-50 hover:bg-gray-100"
            : "hover:bg-blue-50 cursor-pointer"
        }`}
    >
      <div className="flex flex-col h-full">
        <div
          className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
            isToday ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {day}
        </div>

        {totalCount > 0 && (
          <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-y-auto">
            {statusCounts.map((statusCount) => (
              <StatusBadge
                key={statusCount.label}
                status={statusCount.label}
                count={statusCount.count}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: number;
  count: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, count }) => {
  const statusName = formatStatus(AppointmentStatus[status]);
  const colorClass = STATUS_COLORS[status] || "bg-gray-500";

  return (
    <div
      className={`${colorClass} text-white rounded px-1 sm:px-2 py-0.5 sm:py-1 flex items-center justify-between text-[10px] sm:text-xs font-medium shadow-sm`}
    >
      <div className="flex items-center space-x-0.5 sm:space-x-1 flex-1 min-w-0">
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full flex-shrink-0"></div>
        <span className="truncate">{statusName}</span>
      </div>
      <span className="ml-1 sm:ml-2 font-bold flex-shrink-0">{count}</span>
    </div>
  );
};

const StatusLegend: React.FC = () => {
  const statuses = [
    { status: AppointmentStatus.PENDING, name: "Pending" },
    { status: AppointmentStatus.APPROVED, name: "Approved" },
    { status: AppointmentStatus.RESCHEDULED, name: "Rescheduled" },
    { status: AppointmentStatus.CANCELLED, name: "Cancelled" },
    { status: AppointmentStatus.COMPLETED, name: "Completed" },
    { status: AppointmentStatus.NO_SHOW, name: "No Show" },
  ];

  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
        Status Legend
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {statuses.map(({ status, name }) => {
          const colorClass = STATUS_COLORS[status];
          return (
            <div
              key={status}
              className="flex items-center space-x-1.5 sm:space-x-2"
            >
              <div
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${colorClass}`}
              ></div>
              <span className="text-[10px] sm:text-xs text-gray-700 truncate">
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverallAppointmentCalendar;
