import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Clock,
  // Check,
  // X,
  // UserRoundX,
  // History,
} from "lucide-react";
import { useParams } from "react-router";
import { appointmentService } from "@/services/appointmentService";
import { GetUserAppointmentDetailsDTO } from "@/types/appointmentTypes";
import {
  AppointmentReasons,
  AppointmentStatus,
  AppointmentType,
} from "@/enums/commons";
import {
  formatStatus,
  getBadgeAppointmentStatusColor,
  toPhilippineDateString,
} from "@/utilities/helpers";
import Badge from "@/components/badge/Badge";
// import IconButton from "@/components/buttons/IconButton";
import { useModal } from "@/hooks/useModal";
import ApprovalModal from "@/components/modals/ApprovalModal";
import SpinLoading from "@/components/loadings/SpinLoading";
import { getAppointmentCardColors } from "@/utilities/colorHelpers";
import AppointmentModal from "./AppointmentModal";

const TIME_SLOT_CONFIG = {
  START_HOUR: 8,
  END_HOUR: 17,
  SLOT_INTERVAL: 30, // minutes
};

export interface SetAppointmentStatusData {
  appointment: GetUserAppointmentDetailsDTO;
  status: AppointmentStatus;
}

const AppointmentDailySchedule: React.FC = () => {
  const apporvalModal = useModal();
  const { date: rawDate } = useParams<{ date: string }>();
  const [appointments, setAppointments] = useState<
    GetUserAppointmentDetailsDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApprovalStatus, setSelectedApprovalStatus] =
    useState<SetAppointmentStatusData | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const date = rawDate?.replace(/^date=/, "") || "";

  const fetchAppointments = async () => {
    if (!date) return;

    setIsLoading(true);
    try {
      const monthParam = toPhilippineDateString(date);
      if (!monthParam) return;

      const response = await appointmentService.GetAppointmentsByDate(
        monthParam
      );
      setAppointments(response || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [date]);

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const { START_HOUR, END_HOUR, SLOT_INTERVAL } = TIME_SLOT_CONFIG;

    for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      slots.push(`${hourStr}:00`);

      if (hour !== END_HOUR) {
        const minutes = SLOT_INTERVAL.toString().padStart(2, "0");
        slots.push(`${hourStr}:${minutes}`);
      }
    }

    return slots;
  };

  const normalizeDate = (dateInput: string | Date): string => {
    if (dateInput instanceof Date) {
      return dateInput.toISOString().split("T")[0];
    }
    return dateInput.split("T")[0];
  };

  const normalizeTime = (timeStr: string): string => {
    return timeStr.substring(0, 5);
  };

  const getAppointmentsForTimeSlot = (
    timeSlot: string
  ): GetUserAppointmentDetailsDTO[] => {
    if (!date) return [];

    return appointments.filter((appointment) => {
      const appointmentDate = normalizeDate(appointment.AppointmentDate);
      const appointmentTime = normalizeTime(appointment.AppointmentTime);

      return appointmentDate === date && appointmentTime === timeSlot;
    });
  };

  const formatDate = (dateStr: string): string => {
    const dateObj = new Date(dateStr + "T00:00:00");
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTotalAppointmentsForDate = (): number => {
    if (!date) return 0;
    return appointments.filter(
      (apt) => normalizeDate(apt.AppointmentDate) === date
    ).length;
  };

  const timeSlots = generateTimeSlots();

  if (!date) {
    return (
      <div className="max-w-7xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white border rounded-lg p-4 sm:p-6 text-center">
          <p className="text-gray-600">No date selected</p>
        </div>
      </div>
    );
  }

  const handleApprovalModalOpen = (
    appointment: GetUserAppointmentDetailsDTO,
    status: AppointmentStatus
  ) => {
    setSelectedApprovalStatus({ appointment, status });
    apporvalModal.openModal();
  };

  const handleApprovalModalClose = async (isSubmit: boolean) => {
    if (isSubmit && selectedApprovalStatus) {
      setSubmitLoading(true);
      const response = await appointmentService.SetAppointmentStatus(
        selectedApprovalStatus.appointment.Id,
        selectedApprovalStatus.status
      );

      if (response) fetchAppointments();
      setSubmitLoading(false);
    }
    apporvalModal.closeModal();
    setSelectedApprovalStatus(null);
  };

  const reschedOnSuccess = (isSuccess: boolean) => {
    if(isSuccess){
      fetchAppointments();
    }
  }

  return (
    <>
      {apporvalModal.isOpen && (
        <ApprovalModal
          buttonLoading={submitLoading}
          isOpen={apporvalModal.isOpen}
          title={`${formatStatus(
            AppointmentStatus[selectedApprovalStatus!.status]
          )} APPOINTMENT`}
          description={`Are you sure you want to ${formatStatus(
            AppointmentStatus[selectedApprovalStatus!.status]
          )} 
            this appointment for ${selectedApprovalStatus?.appointment.Name}?`}
          onClose={handleApprovalModalClose}
        />
      )}
      <div className="max-w-7xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                  {formatDate(date)}
                </h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                  All schedules for this date
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="bg-white  rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <div className="flex items-center h-100 gap-2 justify-center">
              <SpinLoading size={18} />
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {timeSlots.map((timeSlot, index) => {
              const appointmentsInSlot = getAppointmentsForTimeSlot(timeSlot);
              const isLastSlot = index === timeSlots.length - 1;

              return (
                <TimeSlotRow
                  onSuccess={reschedOnSuccess}
                  key={timeSlot}
                  timeSlot={timeSlot}
                  onApproveClick={handleApprovalModalOpen}
                  appointments={appointmentsInSlot}
                  isLastSlot={isLastSlot}
                  formatTime={formatTime}
                />
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600">
            <span>
              Total appointments:{" "}
              <strong className="text-gray-800">
                {getTotalAppointmentsForDate()}
              </strong>
            </span>
            <span className="text-xs">
              Working hours: {formatTime("08:00")} - {formatTime("17:00")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

interface TimeSlotRowProps {
  timeSlot: string;
  appointments: GetUserAppointmentDetailsDTO[];
  isLastSlot: boolean;
  formatTime: (time: string) => string;
  onApproveClick?: (
    appointment: GetUserAppointmentDetailsDTO,
    status: AppointmentStatus
  ) => void;
  onSuccess?: (isSuccess: boolean) => void;
}

const TimeSlotRow: React.FC<TimeSlotRowProps> = ({
  timeSlot,
  appointments,
  isLastSlot,
  formatTime,
  onApproveClick,
  onSuccess,
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row border-gray-200 ${
        !isLastSlot ? "border-b" : ""
      }`}
    >
      <div className="w-full sm:w-32 flex-shrink-0 p-3 sm:p-4 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            {formatTime(timeSlot)}
          </span>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-4 min-h-[80px] sm:min-h-[120px]">
        {appointments.length === 0 ? (
          <div className="text-gray-400 text-sm italic">No appointments</div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.Id}
                appointment={appointment}
                formatTime={formatTime}
                onApproveClick={onApproveClick}
                onSuccess={onSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: GetUserAppointmentDetailsDTO;
  formatTime: (time: string) => string;
  onApproveClick?: (
    appointment: GetUserAppointmentDetailsDTO,
    status: AppointmentStatus
  ) => void;
  onSuccess?: (isSuccess: boolean) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  formatTime,
  // onApproveClick,
  onSuccess,
}) => {
  const reschedAppointmentModal = useModal();
  const [selectedAppointment] = useState<
    GetUserAppointmentDetailsDTO | null
  >(null);``

  const status = formatStatus(AppointmentStatus[appointment.Status]);
  const reason =
    formatStatus(AppointmentReasons[appointment.Reason]) || "Unknown";
  const type = formatStatus(AppointmentType[appointment.Type]) || "Unknown";

  const handleRescheduleClose = (isSuccess: boolean) => {
    if(isSuccess){
      onSuccess && onSuccess(true);
    }
    reschedAppointmentModal.closeModal();
  }

  // const handleOpenReschedule = (appointment: GetUserAppointmentDetailsDTO) => {
  //   setSelectedAppointment(appointment);
  //   reschedAppointmentModal.openModal();
  // }

  return (
    <>  
      <AppointmentModal isOpen={reschedAppointmentModal.isOpen} onClose={handleRescheduleClose} isReschedule appointmentId={selectedAppointment?.Id}/>
      <div
        className={`${getAppointmentCardColors(
          appointment.Status
        )} border-l-2 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <User className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span className="font-semibold text-gray-800 text-sm sm:text-base truncate flex-1 min-w-0">
              {appointment.Name}
            </span>
            <Badge color={getBadgeAppointmentStatusColor(appointment.Status)}>
              {status}
            </Badge>
          </div>

          <div className="space-y-1 text-xs sm:text-sm">
            <AppointmentDetail
              label="Time"
              value={formatTime(appointment.AppointmentTime)}
            />
            <AppointmentDetail label="Reason" value={reason} />

            {appointment.OtherReason && (
              <AppointmentDetail label="Note" value={appointment.OtherReason} />
            )}

            <AppointmentDetail label="Type" value={type} />
          </div>

          {/* <div className="flex flex-wrap gap-2 pt-2 border-t border-sky-200">
            {appointment.Status === AppointmentStatus.PENDING ? (
              <>
                <IconButton
                  tooltipTitle="APPROVE APPOINTMENT"
                  addedClass="edit-icon bg-green-100 hover:bg-green-600"
                  icon={() => <Check size={15} />}
                  onClick={() => {
                    onApproveClick &&
                      onApproveClick(appointment, AppointmentStatus.APPROVED);
                  }}
                />
                <IconButton
                  tooltipTitle="REJECT APPOINTMENT"
                  addedClass="reject-icon"
                  icon={() => <X size={15} />}
                  onClick={() => {
                    onApproveClick &&
                      onApproveClick(appointment, AppointmentStatus.CANCELLED);
                  }}
                />
              </>
            ) : appointment.Status === AppointmentStatus.CANCELLED ? (
              <IconButton
                tooltipTitle="RESCHEDULE APPOINTMENT"
                addedClass="reject-icon"
                icon={() => <History size={15} />}
                onClick={() => handleOpenReschedule(appointment)}
              />
            ) : appointment.Status === AppointmentStatus.NO_SHOW ? (
              <>
                <div>
                  <span className="text-sm text-gray-600 italic">
                    This appointment was marked as no show.
                  </span>
                </div>
              </>
            ) : appointment.Status === AppointmentStatus.COMPLETED ? (
              <>
                <div>
                  <span className="text-sm text-gray-600 italic">
                    This appointment was completed.
                  </span>
                </div>
              </>
            ) : (
              <>
                <IconButton
                  tooltipTitle="MARK AS NO SHOW"
                  addedClass="payment-icon"
                  icon={() => <UserRoundX size={15} />}
                  onClick={() => {}}
                />
              </>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

interface AppointmentDetailProps {
  label: string;
  value: string;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start sm:items-center text-gray-700">
      <span className="font-medium mr-2 flex-shrink-0">{label}:</span>
      <span className="break-words">{value}</span>
    </div>
  );
};

export default AppointmentDailySchedule;
