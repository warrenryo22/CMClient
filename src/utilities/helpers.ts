import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DecodedRefreshToken } from "../types/authTypes";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { AxiosError } from "axios";
import { GeneralResponse } from "@/types/globalTypes";
import toast from "react-hot-toast";
import { AppointmentStatus, ApprovalStatus, FilterTimeIntervals } from "@/enums/commons";
import { BadgeColor } from "@/components/badge/Badge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const decodeRefreshToken = (
  token: string,
): DecodedRefreshToken | null => {
  try {
    const decodedToken = jwtDecode<any>(token);

    const { exp, sub, role, email, fullName } = decodedToken;

    if (!exp || !sub || !role) return null;

    return {
      nameid: sub,
      email: email || null,
      role,
      exp,
      fullName: fullName || null,
    };
  } catch (error) {
    return null;
  }
};

export const formatDate = (
  date: Date | null | undefined,
  fullDate: boolean = false,
): string => {
  if (!date) return "--";

  if (fullDate) return dayjs(date).format("MMMM D, YYYY hh:mm A");
  return dayjs(date).format("MMMM D, YYYY");
};

export const handleError = (err: unknown) => {
  const error = err as AxiosError<GeneralResponse<object>>;
  const errorMessage = error.response?.data?.Message || "Something went wrong";
  toast.error(`Request Failed: \n${errorMessage}`, {
    style: {
      whiteSpace: "pre-line",
      fontSize: "0.875rem",
    },
  });
};

export const getBadgeAppointmentStatusColor = (
  status: AppointmentStatus,
): BadgeColor => {
  switch (status) {
    case AppointmentStatus.PENDING:
      return "warning";
    case AppointmentStatus.APPROVED:
      return "success";
    case AppointmentStatus.CHECKUP_DONE:
      return "success";
    case AppointmentStatus.RESCHEDULED:
      return "info";
    case AppointmentStatus.CANCELLED:
    case AppointmentStatus.NO_SHOW:
    case AppointmentStatus.REASSIGN:
      return "error";
    case AppointmentStatus.COMPLETED:
      return "primary";
    default:
      return "light";
  }
};

export const getBadgeApprovalStatusColor = (
  status: ApprovalStatus,
): BadgeColor => {
  switch (status) {
    case ApprovalStatus.PENDING:
      return "warning";
    case ApprovalStatus.APPROVED:
      return "success";
    case ApprovalStatus.REASSIGN:
      return "info";
    case ApprovalStatus.RECEIVED:
      return "dark";
    default:
      return "error";
  }
};

export const formatStatus = (status: string): string => {
  return status.replace(/_/g, " ").toString();
};

export const formatTimeTo12Hour = (time?: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export function toPhilippineDateString(dateInput: string) {
  if (!dateInput) return null;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  const utc = date.getTime() + date.getTimezoneOffset() * 60000;

  const philippineTime = new Date(utc + 8 * 60 * 60 * 1000);

  const year = philippineTime.getFullYear();
  const month = String(philippineTime.getMonth() + 1).padStart(2, "0");
  const day = String(philippineTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const formatCurrencyWithPesoSign = (
  value: number,
  digits: number = 2,
) => {
  const convertedValue = new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: digits,
  }).format(value);

  return `₱ ${convertedValue}`;
};


export const capitalize = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
export const FilterTimeIntervalLabels: Record<FilterTimeIntervals, string> = {
    [FilterTimeIntervals.DAILY]: 'Day',
    [FilterTimeIntervals.WEEKLY]: 'Week',
    [FilterTimeIntervals.MONTHLY]: 'Month',
    [FilterTimeIntervals.YEARLY]: 'Year',
};

export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format date to ISO string but preserve local date
export const formatDateToLocalISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000`;
};

// Helper to format Date object preserving local timezone
export const toLocalISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
};


export const toDateOnlyString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const downloadBase64Pdf = (base64: string, filename: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
};