import type React from "react";
import type { FC, ReactNode } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  autoComplete?: string;
  isPeso?: boolean;
  isQty?: boolean;
  isPercent?: boolean;
  autoFocus?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  isReadOnly?: boolean;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  startIcon,
  endIcon,
  hint,
  autoComplete,
  isPeso,
  isQty,
  isPercent,
  isReadOnly = false,
  autoFocus = false,
  ...rest
}) => {
  let inputClasses = ` h-11 w-full rounded-lg border appearance-none pl-4 pr-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 [appearance:textfield]:not([type="time"]) [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}  ${startIcon ? "pl-10" : "px-4"} ${endIcon ? "pr-10" : "px-4"} `;

  if (isPeso) inputClasses = inputClasses.replace("pl-4", "px-16");
  if (isPercent || isQty) inputClasses = inputClasses.replace("pr-4", "pr-16");

  if (disabled) {
    inputClasses += `cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-sky-300 focus:ring-sky-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-sky-800`;
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-500 dark:text-gray-400 pointer-events-none">
            {startIcon}
          </div>
        )}
        {endIcon && (
          <div className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-600">
            {endIcon}
          </div>
        )}
        {isPeso && (
          <span className="absolute left-0 top-0 h-[42px] px-[12px] flex items-center justify-center border-r border-gray-200 dark:border-gray-800 text-[#4f4f4f] dark:text-gray-400 text-sm font-medium">
            PHP
          </span>
        )}
        {isPercent && (
          <span className="absolute right-0 top-0 h-[42px] px-[12px] flex items-center justify-center border-l border-gray-200 dark:border-gray-800 text-[#4f4f4f] dark:text-gray-400 text-sm font-medium">
            %
          </span>
        )}
        {isQty && (
          <span className="absolute right-0 top-0 h-[42px] px-[12px] flex items-center justify-center border-l border-gray-200 dark:border-gray-800 text-[#4f4f4f] dark:text-gray-400 text-sm font-medium">
            QTY
          </span>
        )}
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onWheel={(e) => e.currentTarget.blur()}
          min={min}
          max={max}
          step={step}
          readOnly={isReadOnly}
          disabled={disabled}
          className={inputClasses}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          {...rest}
        />
      </div>

      {hint && (
        <p
          className={`mt-1.5 text-xs ${error
              ? "text-error-500"
              : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
