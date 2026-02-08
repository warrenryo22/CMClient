import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X} from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  maxWidth?: string;
}

const Popup: React.FC<PopupProps> = ({ 
  isOpen, 
  onClose, 
  triggerRef, 
  children,
  maxWidth = '320px'
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && triggerRef.current && popupRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popupRect = popupRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 10;
        
        // Calculate center position
        let left = triggerRect.left + (triggerRect.width / 2) - (popupRect.width / 2);
        
        // Adjust horizontal position if popup goes off screen
        if (left < padding) {
          left = padding;
        } else if (left + popupRect.width > viewportWidth - padding) {
          left = viewportWidth - popupRect.width - padding;
        }
        
        // Calculate vertical position (try above first)
        let top = triggerRect.top - popupRect.height - 12;
        let positionBelow = false;
        
        // If not enough space above, position below
        if (top < padding) {
          top = triggerRect.bottom + 12;
          positionBelow = true;
        }
        
        // If still not enough space below, position at top with scroll
        if (positionBelow && top + popupRect.height > viewportHeight - padding) {
          top = padding;
        }
        
        setPosition({ top, left });
      }
    };

    updatePosition();
    
    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside the popup
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }
      
      // Don't close if clicking the trigger
      if (triggerRef.current && triggerRef.current.contains(target)) {
        return;
      }
      
      // Close if clicking outside
      onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth: maxWidth,
        zIndex: 9999,
      }}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Arrow pointing to trigger */}
      <div 
        className="absolute w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"
        style={{
          bottom: '-8px',
          left: '50%',
          marginLeft: '-8px',
        }}
      />
      
      <div className="relative p-5">
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="pr-6">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
};
export default Popup;