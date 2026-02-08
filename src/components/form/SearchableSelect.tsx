import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface Option {
  value: any;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: any) => void;
  className?: string;
  value?: any;
  allowClear?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
}

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
  if (!element) return null;
  const { overflowY } = getComputedStyle(element);
  if (overflowY === "auto" || overflowY === "scroll") return element;
  return getScrollParent(element.parentElement);
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value,
  allowClear = false,
  isMulti = false,
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<any>(
    isMulti ? (Array.isArray(value) ? value : []) : value
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchMode, setSearchMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUpward: false,
  });

  const filteredOptions = searchMode
    ? options.filter((option) =>
        (option?.label ?? "")
          .toString()
          .toLowerCase()
          .includes((searchTerm ?? "").toLowerCase())
      )
    : options;

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const displayValue = isMulti
    ? (selectedValue || [])
        .map((val: any) => options.find((o) => o.value === val)?.label)
        .filter(Boolean)
        .join(", ")
    : selectedOption?.label || "";

  useEffect(() => {
    if (isMulti) {
      setSelectedValue(Array.isArray(value) ? value : []);
    } else {
      setSelectedValue(value);
    }
  }, [value, isMulti]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        setSearchMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      !isOpen &&
      (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
    ) {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        setSearchMode(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleOptionSelect = (option: Option) => {
    if (isMulti) {
      let newSelected;
      if (selectedValue.includes(option.value)) {
        newSelected = selectedValue.filter((v: any) => v !== option.value);
      } else {
        newSelected = [...selectedValue, option.value];
      }
      setSelectedValue(newSelected);
      onChange(newSelected);
    } else {
      setSelectedValue(option.value);
      onChange(option.value);
      setIsOpen(false);
      setSearchMode(false);
    }
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleInputClick = () => {
    if (!disabled && !searchMode) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setHighlightedIndex(-1);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue(isMulti ? [] : undefined);
    onChange(isMulti ? [] : undefined);
    setSearchTerm("");
    setIsOpen(false);
    setSearchMode(false);
  };

  const handleSearchToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSearchMode = !searchMode;
    setSearchMode(newSearchMode);
    if (newSearchMode) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const scrollParent = getScrollParent(containerRef.current);
    const updatePosition = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const dropdownHeight = 250; // max-h-60 is approximately 240px + padding
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setDropdownPosition({
        top: shouldOpenUpward ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        openUpward: shouldOpenUpward,
      });
    };

    const handleHide = () => {
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
      setSearchMode(false);
    };

    updatePosition();
    scrollParent?.addEventListener("scroll", handleHide);
    window.addEventListener("resize", updatePosition);

    return () => {
      scrollParent?.removeEventListener("scroll", handleHide);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <style>{`
                @keyframes dropdown-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes dropdown-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-dropdown-down {
                    animation: dropdown-down 0.15s ease-out;
                }

                .animate-dropdown-up {
                    animation: dropdown-up 0.15s ease-out;
                }

                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }

                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 3px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                }

                .dark .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #4a5568;
                }

                .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #718096;
                }
            `}</style>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-20 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-1 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
            selectedValue !== undefined
              ? "text-gray-800 dark:text-white/90"
              : "text-gray-400 dark:text-gray-400"
          } ${!searchMode ? "cursor-pointer" : ""} ${className}`}
          value={searchMode ? searchTerm : displayValue}
          onChange={handleSearchChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={
            isMulti
              ? selectedValue.length === 0
                ? placeholder
                : ""
              : selectedValue === undefined
              ? placeholder
              : ""
          }
          autoComplete="off"
          readOnly={!searchMode}
        />

        <div className="absolute top-3 right-0 flex items-center pr-3 gap-1">
          {allowClear &&
            (isMulti
              ? selectedValue.length > 0
              : selectedValue !== undefined) && (
              <div
                className="flex items-center cursor-pointer"
                onClick={handleClear}
                title="Clear selection"
              >
                <svg
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}

          <div
            className="flex items-center cursor-pointer"
            onClick={handleSearchToggle}
            title={searchMode ? "Hide search" : "Search"}
          >
            <svg
              className={`w-4 h-4 transition ${
                searchMode
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center pointer-events-none">
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {isOpen &&
        !disabled &&
        createPortal(
          <div
            className={`z-[9999] fixed bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto scrollbar-thin ${
              dropdownPosition.openUpward ? "mb-1" : "mt-1"
            }`}
            style={{
              top: dropdownPosition.openUpward ? 'auto' : dropdownPosition.top,
              bottom: dropdownPosition.openUpward ? `${window.innerHeight - dropdownPosition.top}px` : 'auto',
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            <div ref={optionsRef}>
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = isMulti
                    ? selectedValue.includes(option.value)
                    : selectedValue === option.value;
                  return (
                    <div
                      key={option.value}
                      className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                        highlightedIndex === index
                          ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                          : selectedValue === option.value
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                      onMouseDown={() => handleOptionSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {option.label}
                      {isSelected && (
                        <svg
                          className="inline-block w-4 h-4 ml-2 text-brand-600 dark:text-brand-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SearchableSelect