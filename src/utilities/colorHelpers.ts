import { AppointmentStatus } from "@/enums/commons";

export const getAppointmentCardColors = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.PENDING:
      return "bg-amber-50 border-amber-500"; // Warm amber for pending
    case AppointmentStatus.APPROVED:
      return "bg-emerald-50 border-emerald-600"; // Rich green for approved
    case AppointmentStatus.RESCHEDULED:
      return "bg-blue-50 border-blue-500"; // Medium blue for rescheduled
    case AppointmentStatus.CANCELLED:
      return "bg-red-50 border-red-500"; // Red for cancelled
    case AppointmentStatus.NO_SHOW:
      return "bg-gray-200 border-gray-500"; // Gray for no show
    case AppointmentStatus.COMPLETED:
      return "bg-indigo-50 border-indigo-600"; // Indigo for completed
    default:
      return "bg-gray-50 border-gray-400"; // Default gray
  }
};
