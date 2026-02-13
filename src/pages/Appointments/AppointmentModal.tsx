import React, { useEffect, useState } from "react";
import { Calendar, Clock, FileText } from "lucide-react";
import { MainModal } from "@/components/modals/MainModal";
import TextArea from "@/components/input/TextArea";
import Label from "@/components/form/Label";
import { appointmentService } from "@/services/appointmentService";
import {
  CreateAppointmentDTO,
  GetAppointmentDatesDTO,
  RescheduleAppointmentDTO,
} from "@/types/appointmentTypes";
import { AppointmentReasons } from "@/enums/commons";
import toast from "react-hot-toast";
import SpinLoading from "@/components/loadings/SpinLoading";
import ContentLoading from "@/components/loadings/ContentLoading";
import { formatTimeTo12Hour } from "@/utilities/helpers";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  isReschedule?: boolean;
  appointmentId?: number | null;
}

interface StepConfig {
  num: number;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
}

const AppointmentModal = ({
  isOpen,
  onClose,
  isReschedule = false,
  appointmentId = null,
}: AppointmentModalProps) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] =
    useState<AppointmentReasons | null>(null);
  const [reason, setReason] = useState<string>("");
  const [rescheduleReason, setRescheduleReason] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [bookedAppointments, setBookedAppointments] =
    useState<GetAppointmentDatesDTO>();
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const getUTCDateString = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getReasonLabel = (reason: AppointmentReasons): string => {
    const labels: Record<AppointmentReasons, string> = {
      [AppointmentReasons.FEVER_OR_FLU_LIKE_SYMPTOMS]:
        "Fever or Flu-like Symptoms",
      [AppointmentReasons.HEADACHE_OR_MIGRAINE]: "Headache or Migraine",
      [AppointmentReasons.STOMACHACHE_OR_DIGESTIVE_PROBLEMS]:
        "Stomachache or Digestive Problems",
      [AppointmentReasons.MINOR_INJURY_OR_ACCIDENT]: "Minor Injury or Accident",
      [AppointmentReasons.ALLERGY_OR_ASTHMA_RELATED_SYMPTOMS]:
        "Allergy or Asthma-related Symptoms",
      [AppointmentReasons.DENTAL_PAIN_OR_ORAL_HEALTH_CONCERNS]:
        "Dental Pain or Oral Health Concerns",
      [AppointmentReasons.SKIN_CONDITIONS_OR_RASHES]:
        "Skin Conditions or Rashes",
      // [AppointmentReasons.MEDICAL_CLEARANCE_OR_HEALTH_CERTIFICATION]:
      //   "Medical Clearance or Health Certification",
      [AppointmentReasons.FOLLOW_UP_CHECK_UP]: "Follow-up Check-up",
      [AppointmentReasons.OTHER_HEALTH_CONCERNS]: "Other Health Concerns",
    };
    return labels[reason];
  };

  useEffect(() => {
    if (!isOpen) return;

    const getDates = async () => {
      setIsLoading(true);
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
      const monthParam = `${year}-${month}`;
      const response = await appointmentService.GetAppointmentDates(monthParam);
      setBookedAppointments(response);
      setIsLoading(false);
    };

    getDates();
  }, [currentMonth, isOpen, step]);

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour !== 17) slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isTimeSlotInPast = (time: string, date: Date): boolean => {
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const dateUTC = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (dateUTC !== todayUTC) return false;

    const [hours, minutes] = time.split(":").map(Number);
    const slot = new Date(date);
    slot.setHours(hours, minutes, 0, 0);

    return slot <= now;
  };

  const areAllTimeSlotsBooked = (dateStr: string): boolean => {
    const bookedCount = bookedAppointments?.[dateStr]?.length || 0;
    return bookedCount >= timeSlots.length;
  };

  const isTimeSlotBooked = (time: string): boolean => {
    if (!selectedDate) return false;
    const dateStr = getUTCDateString(selectedDate);
    return (
      bookedAppointments?.[dateStr]?.some((apt) => apt.Time === time) || false
    );
  };

  const getAvailableSlotsCount = (dateStr: string): number => {
    const bookedCount = bookedAppointments?.[dateStr]?.length || 0;
    return timeSlots.length - bookedCount;
  };

  const getCalendarDays = (): (Date | null)[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const daysInMonth = lastDay.getUTCDate();
    const startingDayOfWeek = firstDay.getUTCDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      days.push(new Date(Date.UTC(year, month, d)));

    return days;
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const selectedUTC = new Date(date);
    selectedUTC.setUTCHours(0, 0, 0, 0);

    // const dayOfWeek = date.getUTCDay();
    const dateStr = getUTCDateString(date);

    // if (dayOfWeek === 0 || dayOfWeek === 6) return;
    if (selectedUTC < today) return;
    if (areAllTimeSlotsBooked(dateStr)) return;

    setSelectedDate(date);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;

    if (isReschedule && appointmentId) {
      if (!rescheduleReason.trim()) {
        toast.error("Please provide a reason for rescheduling");
        return;
      }

      try {
        setSubmitLoading(true);

        const response = await appointmentService.RescheduleAppointment(
          new RescheduleAppointmentDTO({
            AppointmentId: appointmentId,
            NewDate: selectedDate,
            NewTime: selectedTime,
            RescheduleReason: rescheduleReason,
          })
        );

        if(response) handleClose(true);
      } catch (error) {
        toast.error("Failed to reschedule appointment");
      } finally {
        setSubmitLoading(false);
      }
      return;
    }

    // For new appointment
    if (!selectedReason) return;
    if (
      selectedReason === AppointmentReasons.OTHER_HEALTH_CONCERNS &&
      !reason.trim()
    ) {
      toast.error("Please specify your reason");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = new CreateAppointmentDTO({
        Date: selectedDate,
        Time: selectedTime,
        Reason: selectedReason,
        SpecifiedReason: reason,
      });

      const response = await appointmentService.CreateAppointment(payload);

      if (response) {
        handleClose(true);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClose = (success = false) => {
    onClose(success);
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedReason(null);
    setReason("");
    setRescheduleReason("");
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth((prevMonth) => {
      return new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + offset,
        1
      );
    });
  };

  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const stepConfigs: StepConfig[] = isReschedule
    ? [
        { num: 1, title: "Select Date", icon: Calendar },
        { num: 2, title: "Choose Time", icon: Clock },
        { num: 3, title: "Reschedule Reason", icon: FileText },
      ]
    : [
        { num: 1, title: "Select Date", icon: Calendar },
        { num: 2, title: "Choose Time", icon: Clock },
        { num: 3, title: "Add Reason", icon: FileText },
      ];

  return (
    <MainModal
      title={isReschedule ? "RESCHEDULE APPOINTMENT" : "CREATE APPOINTMENT"}
      isOpen={isOpen}
      onClose={() => handleClose(false)}
      className="max-w-3xl"
    >
      <>
        <div className="flex items-center justify-center gap-2 px-6 py-4">
          {stepConfigs.map(({ num, title, icon: Icon }, idx) => (
            <React.Fragment key={num}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition ${
                    step >= num
                      ? "bg-sky-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-xs font-medium ${
                    step >= num ? "text-sky-600" : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`h-1 w-16 mt-[-20px] ${
                    step > num ? "bg-sky-600" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => changeMonth(-1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  ← Prev
                </button>
                <h3 className="text-xl font-bold text-gray-800">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => changeMonth(1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Next →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 relative">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-gray-600 text-sm py-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-50/60 h-full flex items-center justify-center z-10">
                    <SpinLoading size={30} colorClass="border-sky-500" />
                  </div>
                )}
                {getCalendarDays().map((date, idx) => {
                  if (!date)
                    return <div key={`empty-${idx}`} className="p-2" />;

                  const dateStr = getUTCDateString(date);
                  const todayUTC = new Date();
                  todayUTC.setUTCHours(0, 0, 0, 0);
                  const isPast = date < todayUTC;
                  // const dayOfWeek = date.getUTCDay();
                  // const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const allBooked = areAllTimeSlotsBooked(dateStr);
                  const available = getAvailableSlotsCount(dateStr);
                  const disabled = isPast  || allBooked;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateSelect(date)}
                      disabled={disabled}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center text-sm transition relative ${
                        disabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-200 hover:border-sky-500 hover:bg-sky-50 cursor-pointer"
                      }`}
                    >
                      <span className="font-semibold">{date.getUTCDate()}</span>
                      {!isPast && (
                        <span
                          className={`text-xs mt-1 ${
                            allBooked
                              ? "text-red-500 font-semibold"
                              : available < timeSlots.length
                              ? "text-amber-500"
                              : "text-green-500"
                          }`}
                        >
                          {allBooked ? "Full" : `${available} left`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && selectedDate && (
            <div>
              <div className="mb-6 p-4 text-sm bg-sky-50 rounded-lg flex items-center gap-2 text-sky-600">
                <Calendar size={20} />
                <span>{formatDate(selectedDate)}</span>
              </div>

              <h3 className="text-sm mb-4 flex items-center gap-2">
                <Clock size={18} /> Available Time Slots
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-50/60 h-full flex items-center justify-center z-10">
                    <SpinLoading size={30} colorClass="border-sky-500" />
                  </div>
                )}
                {timeSlots.map((time) => {
                  const disabled =
                    isTimeSlotBooked(time) ||
                    isTimeSlotInPast(time, selectedDate);
                  return (
                    <button
                      key={time}
                      onClick={() => !disabled && handleTimeSelect(time)}
                      disabled={disabled}
                      className={`py-3 px-4 rounded-lg font-medium transition ${
                        disabled
                          ? "bg-red-100 text-red-400 cursor-not-allowed"
                          : "bg-white border border-gray-200 hover:border-sky-500 hover:bg-sky-50"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-6 text-sm w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Calendar
              </button>
            </div>
          )}

          {step === 3 && selectedDate && selectedTime && (
            <div>
              <div className="mb-6 space-y-3">
                <div className="p-4 text-sm bg-sky-50 rounded-lg flex items-center gap-2 text-sky-800">
                  <Calendar size={20} />
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="p-4 text-sm bg-green-50 rounded-lg flex items-center gap-2 text-green-800">
                  <Clock size={20} />
                  <span>{formatTimeTo12Hour(selectedTime)}</span>
                </div>
              </div>

              {isReschedule && appointmentId ? (
                <>
                  <Label>Reason for Rescheduling</Label>
                  <TextArea
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e)}
                    placeholder="Please explain why you need to reschedule this appointment..."
                  />
                </>
              ) : (
                <>
                  <Label>Reason for Appointment</Label>
                  <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                    {Object.values(AppointmentReasons)
                      .filter((value) => typeof value === "number")
                      .map((reasonEnum) => (
                        <label
                          key={reasonEnum}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                        >
                          <input
                            type="radio"
                            name="appointmentReason"
                            value={reasonEnum}
                            checked={selectedReason === reasonEnum}
                            onChange={() => {
                              setSelectedReason(
                                reasonEnum as AppointmentReasons
                              );
                              if (
                                reasonEnum !==
                                AppointmentReasons.OTHER_HEALTH_CONCERNS
                              ) {
                                setReason("");
                              }
                            }}
                            className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                          />
                          <span className="text-sm text-gray-700">
                            {getReasonLabel(reasonEnum as AppointmentReasons)}
                          </span>
                        </label>
                      ))}
                  </div>

                  {selectedReason ===
                    AppointmentReasons.OTHER_HEALTH_CONCERNS && (
                    <div className="mb-4">
                      <Label>Please specify your health concern</Label>
                      <TextArea
                        value={reason}
                        onChange={(e) => setReason(e)}
                        placeholder="Please describe your health concern..."
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    (isReschedule && appointmentId
                      ? !rescheduleReason.trim()
                      : !selectedReason ||
                        (selectedReason ===
                          AppointmentReasons.OTHER_HEALTH_CONCERNS &&
                          !reason.trim())) || submitLoading
                  }
                  className={`flex-1 py-3 rounded-lg text-sm transition ${
                    (
                      isReschedule && appointmentId
                        ? rescheduleReason.trim()
                        : selectedReason &&
                          (selectedReason !==
                            AppointmentReasons.OTHER_HEALTH_CONCERNS ||
                            reason.trim())
                    )
                      ? "bg-sky-600 text-white hover:bg-sky-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ContentLoading
                    isLoading={submitLoading}
                    colorClass="border-white border-3!"
                    size={20}
                    loadingContent="Processing..."
                  >
                    {isReschedule
                      ? "Confirm Reschedule"
                      : "Confirm Appointment"}
                  </ContentLoading>
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    </MainModal>
  );
};

export default AppointmentModal;
