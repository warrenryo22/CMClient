import React from "react";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  X 
} from "lucide-react";

type AlertVariant = "default" | "approved" | "reject" | "warning" | "info" | "success" | "error";

const variantStyles: Record<AlertVariant, string> = {
  default: "bg-white border-gray-300 text-gray-900",
  approved: "bg-green-50 border-green-200 text-green-900",
  reject: "bg-red-50 border-red-200 text-red-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
  info: "bg-blue-50 border-blue-200 text-blue-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  error: "bg-rose-50 border-rose-200 text-rose-900",
};

const iconConfig: Record<AlertVariant, { icon: React.ElementType; className: string }> = {
  default: { icon: Info, className: "text-gray-500" },
  approved: { icon: CheckCircle, className: "text-green-600" },
  reject: { icon: XCircle, className: "text-red-600" },
  warning: { icon: AlertTriangle, className: "text-yellow-600" },
  info: { icon: Info, className: "text-blue-600" },
  success: { icon: CheckCircle, className: "text-emerald-600" },
  error: { icon: AlertCircle, className: "text-rose-600" },
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className = "", 
    variant = "default", 
    title, 
    description, 
    onClose,
    showIcon = true,
    children,
    ...props 
  }, ref) => {
    const Icon = iconConfig[variant].icon;
    const baseClasses = "relative w-full rounded-lg border p-4 flex items-start gap-3";
    const variantClass = variantStyles[variant];
    const combinedClasses = `${baseClasses} ${variantClass} ${className}`;

    return (
      <div
        ref={ref}
        role="alert"
        className={combinedClasses}
        {...props}
      >
        {showIcon && (
          <div className="flex-shrink-0 mt-0.5">
            <Icon className={`h-5 w-5 ${iconConfig[variant].className}`} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h5 className="mb-1 font-semibold leading-none tracking-tight">
              {title}
            </h5>
          )}
          {description && (
            <div className="text-sm opacity-90">
              {description}
            </div>
          )}
          {children && (
            <div className="text-sm opacity-90">
              {children}
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors ml-2"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;