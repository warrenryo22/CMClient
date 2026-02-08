import { ComponentType, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SpinLoading from "../loadings/SpinLoading";

type HeaderProps = {
  tooltipTitle: string;
  addedClass: string;
  disabled?: boolean;
  onClick: () => void;
  icon: ComponentType;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
};

function IconButton({
  tooltipTitle,
  addedClass,
  onClick,
  icon: Icon,
  disabled = false,
  isLoading = false,
  type = "button",
}: HeaderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (showTooltip && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY - 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [showTooltip]);

  const handleClick = () => {
    setShowTooltip(false);
    onClick();
  };

  return (
    <>
      <button
        ref={buttonRef}
        disabled={disabled || isLoading}
        type={type}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`relative text-white p-2 rounded-md shadow-theme-xs ${addedClass}`}
      >
        <span
          className={`${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity`}
        >
          <Icon />
        </span>

        {isLoading && (
          <span className="absolute flex items-center justify-center">
            <SpinLoading  size={25} />
          </span>
        )}
      </button>

      {showTooltip &&
        createPortal(
          <div
            className="absolute z-[9999] transform -translate-x-1/2 -translate-y-full"
            style={{
              top: position.top,
              left: position.left,
              position: "absolute",
            }}
          >
            <div className="relative">
              <div className="drop-shadow-4xl whitespace-nowrap rounded-lg bg-[#1E2634] px-3 py-2 text-xs font-medium text-white">
                {tooltipTitle}
              </div>
              <div className="absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-[#1E2634]"></div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default IconButton;
