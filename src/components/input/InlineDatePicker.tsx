import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "@/components/form/Label";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range";
  value?: Date | Date[] | null;
  onChange?: (value: Date | Date[] | null) => void;
  defaultDate?: Date | Date[];
  label?: string;
  className?: string;
  showMonths?: number;
};
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export default function InlineDatePicker({
  id,
  mode = "single",
  value,
  onChange,
  defaultDate,
  label,
  className = "",
  showMonths,
}: PropsType) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    instanceRef.current = flatpickr(calendarRef.current, {
      mode,
      inline: true, // This makes the calendar always visible
      static: true,
      monthSelectorType: "static",
      dateFormat: mode === "range" ? "M d, Y" : "M d, Y",
      defaultDate: value || defaultDate,
      showMonths: showMonths ?? (mode === "range" ? 2 : 1),
      onChange: (selectedDates) => {
        if (mode === "range") {
          if (selectedDates.length === 2) {
            const normalizedDates = selectedDates.map(normalizeDate);
            onChange?.(normalizedDates);
          } else if (selectedDates.length === 0) {
            onChange?.(null);
          }
        } else if (mode === "multiple") {
          const normalizedDates = selectedDates.map(normalizeDate);
          onChange?.(normalizedDates.length > 0 ? normalizedDates : null);
        } else {
          onChange?.(selectedDates[0] ? normalizeDate(selectedDates[0]) : null);
        }
      },
    });

    return () => {
      instanceRef.current?.destroy();
    };
  }, [mode, onChange, showMonths]);

  // Update flatpickr when value changes externally
  useEffect(() => {
    if (instanceRef.current && value !== undefined) {
      instanceRef.current.setDate(value || []);
    }
  }, [value]);

  const formatDisplayDate = () => {
    if (!value) return null;

    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      if (mode === "range" && value.length === 2) {
        return `${value[0].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${value[1].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
      }
      return value
        .map((d) =>
          d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        )
        .join(", ");
    }

    return value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayDate = formatDisplayDate();

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div
        ref={calendarRef}
        id={id}
        className="inline-calendar-responsive"
      ></div>
      {displayDate && (
        <div className="mt-3 p-3 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Selected{" "}
            {mode === "range"
              ? "Range"
              : mode === "multiple"
                ? "Dates"
                : "Date"}
            :
          </p>
          <p className="text-base text-neutral-900 dark:text-neutral-100">
            {displayDate}
          </p>
        </div>
      )}
      <style>{`
        .inline-calendar-responsive .flatpickr-calendar {
          width: 100% !important;
        }
        
        @media (max-width: 640px) {
          .inline-calendar-responsive .flatpickr-months {
            flex-direction: column !important;
          }
          
          .inline-calendar-responsive .flatpickr-calendar.multiMonth .flatpickr-days {
            width: 100% !important;
          }
          
          .inline-calendar-responsive .flatpickr-calendar.multiMonth .flatpickr-days .dayContainer {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
          }
        }
        
        @media (min-width: 641px) {
          .inline-calendar-responsive .flatpickr-months {
            flex-direction: row !important;
          }
        }
      `}</style>
    </div>
  );
}
