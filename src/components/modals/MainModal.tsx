import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DialogHeader from "../common/DialogHeader";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  parentClassName?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  title?: string;
}

export const MainModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  parentClassName,
  showCloseButton = true,
  isFullscreen = false,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!showCloseButton) return;
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, showCloseButton]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-900 scrollbar-thin";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 px-0 lg:p-5 xl:px-4 ${parentClassName}`}
        >
          {!isFullscreen && (
            <motion.div
              className="fixed inset-0 bg-black/50"
              onClick={() => {
                if (showCloseButton) onClose();
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}

          <motion.div
            ref={modalRef}
            className={`${contentClasses} ${className}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
              >
                <X />
              </button>
            )}
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg">
              {title && <DialogHeader title={title} />}
              <div className="px-2 mt-5">{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
