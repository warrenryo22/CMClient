import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { CalendarIcon } from "lucide-react";
import Label from "@/components/form/Label";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  value?: Date | Date[] | null;
  onChange?: (value: Date | [Date, Date] | null) => void;
  defaultDate?: Date | Date[];
  label?: string;
  placeholder?: string;
  className?: string;
  variant?: "input" | "icon";
  showMonths?: number;
};

export default function DatePicker({
  id,
  mode = "single",
  value,
  onChange,
  defaultDate,
  label,
  placeholder,
  className = "",
  variant = "input",
  showMonths,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const instanceRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    instanceRef.current = flatpickr(inputRef.current, {
      mode,
      position: "auto",
      static: false,
      monthSelectorType: "static",
      dateFormat: mode === "range" ? "M d, Y" : "M d, Y",
      defaultDate: value || defaultDate,
      showMonths: showMonths ?? (mode === "range" ? 2 : 1), // Use prop or default to 2 for range, 1 otherwise
      onChange: (selectedDates) => {
        if (mode === "range") {
          onChange?.(
            selectedDates.length === 2
              ? [selectedDates[0], selectedDates[1]]
              : null,
          );
        } else {
          onChange?.(selectedDates[0] ?? null);
        }
      },
    });

    return () => {
      instanceRef.current?.destroy();
    };
  }, [mode, onChange]);

  // Update flatpickr when value changes externally
  useEffect(() => {
    if (instanceRef.current && value !== undefined) {
      instanceRef.current.setDate(value || []);
    }
  }, [value]);

  const handleIconClick = () => {
    if (variant === "icon" && instanceRef.current) {
      instanceRef.current.open();
    }
  };

  if (variant === "icon") {
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
      <div>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="flex items-center gap-2">
          {displayDate && (
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              {displayDate}
            </span>
          )}
          <div className="relative inline-block">
            <input
              ref={inputRef}
              id={id}
              type="text"
              className="sr-only"
              readOnly
            />
            <button
              type="button"
              onClick={handleIconClick}
              className="flex items-center justify-center w-11 h-11 rounded-lg border text-neutral-500 bg-white border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:focus:border-brand-800"
              aria-label="Open calendar"
            >
              <CalendarIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          placeholder={
            placeholder ||
            (mode === "range" ? "Select date range" : "Select date")
          }
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-3 bg-transparent text-neutral-800 border-neutral-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-neutral-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-neutral-700 dark:focus:border-brand-800 ${className}`}
        />
        <span className="absolute text-neutral-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-neutral-400">
          <CalendarIcon size={20} />
        </span>
      </div>
    </div>
  );
}
