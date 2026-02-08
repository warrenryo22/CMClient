import { Dispatch, SetStateAction } from "react";
import { AppointmentData } from "../types";
import { getAppointmentReasonLabel, getAppointmentStatusColor } from "../utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingOverlay from "@/components/loadings/LoadingOverlay";

interface AppointmentsTabProps {
  appointments: AppointmentData[];
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  currentDate: Date;
  loading: boolean;
}

const AppointmentsTab = ({
  appointments,
  setCurrentDate,
  currentDate,
  loading
}: AppointmentsTabProps) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    return { year, month, startingDayOfWeek, totalDays };
  };

  const getAppointmentsForDate = (day: number): AppointmentData[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toDateString();

    return appointments.filter((apt) => {
      const aptDateStr = new Date(apt.date).toDateString();
      return aptDateStr === dateStr;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const { year, month, startingDayOfWeek, totalDays } = getMonthData();

  const calendarDays = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(
      <div
        key={`empty-${i}`}
        className="h-24 bg-gray-50 dark:bg-gray-900/50"
      ></div>,
    );
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayAppointments = getAppointmentsForDate(day);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    calendarDays.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto ${
          isToday
            ? "bg-sky-50 dark:bg-sky-950/30 border-sky-500"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        <div
          className={`text-sm font-semibold mb-1 ${
            isToday
              ? "text-sky-700 dark:text-sky-400"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {day}
        </div>
        <div className="space-y-1">
          {dayAppointments.map((apt) => (
            <div
              key={apt.appointmentId}
              className={`text-xs px-2 py-1 rounded ${getAppointmentStatusColor(apt.status)}`}
            >
              <div className="font-medium truncate">{apt.time}</div>
              <div className="truncate">
                {getAppointmentReasonLabel(apt.reason)}
              </div>
            </div>
          ))}
        </div>
      </div>,
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {new Date(year, month).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className=" grid grid-cols-7 gap-px mb-px">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          <LoadingOverlay isLoading={loading} size={24}/>
          {appointments.length === 0 && !loading && (
            <div className="absolute bg-gray-100/50 h-full w-full flex items-center justify-center z-10 text-red-500 text-sm">No Appointments for this month</div>
          )}
          {calendarDays}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">
              Rescheduled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTab;
