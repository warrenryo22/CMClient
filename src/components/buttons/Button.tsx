import { ReactNode } from "react";
import CountBadge from "../badge/CountBadge";
import SpinLoading from "../loadings/SpinLoading";

interface ButtonProps {
  children?: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "dashed"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  icon?: ReactNode; // Icon-only button
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  tooltip?: string; // for icon-only buttons
  count?: number; // optional badge count
  type?: "button" | "submit";
  loadingText?: string;
}
  
const   Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  icon,
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  tooltip,
  count,
  type,
  loadingText = "Loading",
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition";

  const variantClasses = {
    primary:
      "bg-sky-700 text-white shadow-theme-xs hover:bg-sky-700/80 disabled:bg-brand-300",
    outline:
      "bg-transparent text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    dashed:
      "bg-transparent text-gray-700 border border-dashed border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  if (!children && icon) {
    return (
      <div
        className={`relative inline-block group ${className} ${disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        onClick={disabled ? undefined : onClick}
      >
        <button
          type={type}
          disabled={disabled || isLoading}
          className={`flex items-center justify-center p-2 rounded-md transition ${disabled ? "opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          {isLoading ? (
            <span className="animate-spin">{/* Spinner SVG */}</span>
          ) : (
            icon
          )}
        </button>

        {tooltip && !disabled && (
          <div className="invisible absolute left-1/2 top-full mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 z-10">
            <div className="relative">
              <div className="whitespace-nowrap rounded-lg bg-slate-300 px-3 py-2 text-xs font-medium text-slate-700 drop-shadow-md dark:bg-white dark:text-slate-700 select-none">
                {tooltip}
              </div>
              <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-slate-300 dark:bg-white"></div>
            </div>
          </div>
        )}

        {count && <CountBadge count={count} />}
      </div>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]
        } ${className} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <SpinLoading  size={20}/>
          <h1>{loadingText}...</h1>
        </div>
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
