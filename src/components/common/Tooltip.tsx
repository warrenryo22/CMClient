import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  title: string;
  children: ReactNode;
  disabled?: boolean;
};

function Tooltip({ title, children, disabled = false }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showTooltip && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY - 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [showTooltip]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>

      {showTooltip &&
        createPortal(
          <div
            className="absolute z-[9999] transform -translate-x-1/2 -translate-y-full"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <div className="relative">
              <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-[#1E2634] px-3 py-2 text-xs font-medium text-white">
                {title}
              </div>
              <div className="absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-[#1E2634]" />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Tooltip;
