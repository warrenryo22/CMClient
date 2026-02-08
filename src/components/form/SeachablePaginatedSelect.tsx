import { debounceMap } from "@/utilities/debounceMap";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface SearchablePaginatedSelectProps<T> {
  tableValues: T[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => any;
  onChange: (value: any) => void;
  value?: any;
  className?: string;
  allowClear?: boolean;
  isMulti?: boolean;
  placeholder?: string;
  searchDebounceMs?: number;
}

export function SearchablePaginatedSelect<T>({
  tableValues,
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  onSearchChange,
  getOptionLabel,
  onChange,
  getOptionValue,
  value,
  className,
  allowClear = false,
  isMulti = false,
  placeholder = "Select an option",
}: SearchablePaginatedSelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState<any>(
    isMulti ? (Array.isArray(value) ? value : []) : value
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const debounceKeyRef = useRef<string>(`search-select-${Math.random()}`);

  useEffect(() => {
    if (isMulti) {
      setSelectedValue(Array.isArray(value) ? value : []);
    } else {
      setSelectedValue(value);
    }
  }, [value, isMulti]);

  useEffect(() => {
    if (!isOpen || !dropdownRef.current || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      },
      {
        root: dropdownRef.current,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [isOpen, isLoading, currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (searchTerm !== "") {
          setSearchTerm("");
          onSearchChange("");
        }
        setSearchMode(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchTerm, onSearchChange]);

  const calculateDropdownPosition = () => {
    if (!containerRef.current || !inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(240, tableValues.length * 40 + 16);

    const spaceBelow = viewportHeight - inputRect.bottom - 8;
    const spaceAbove = inputRect.top - 8;

    setDropdownPosition(
      spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? "top" : "bottom"
    );
  };

  useEffect(() => {
    if (isOpen) calculateDropdownPosition();
  }, [isOpen, tableValues.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResizeScroll = () => calculateDropdownPosition();
    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll, true);
    return () => {
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll, true);
    };
  }, [isOpen, tableValues.length]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setHighlightedIndex(-1);
    if (!isOpen) setIsOpen(true);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }

    debounceMap.debounce(
      debounceKeyRef.current,
      () => {
        onSearchChange(newSearchTerm);
      },
      600
    );
  };

  const handleOptionSelect = (item: T) => {
    const valueToSelect = getOptionValue(item);

    if (isMulti) {
      const newSelected = selectedValue.includes(valueToSelect)
        ? selectedValue.filter((v: any) => v !== valueToSelect)
        : [...selectedValue, valueToSelect];
      setSelectedValue(newSelected);
      onChange(newSelected);
    } else {
      setSelectedValue(valueToSelect);
      onChange(valueToSelect);
      setIsOpen(false);
      setSearchTerm("");
      setSearchMode(false);
    }

    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const clearedValue = isMulti ? [] : null;
    setSelectedValue(clearedValue);
    onChange(clearedValue);
    setSearchTerm("");
    setHighlightedIndex(-1);
    setSearchMode(false);

    debounceMap.clear(debounceKeyRef.current);
    onSearchChange("");
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
      if (searchTerm !== "") {
        onSearchChange("");
      }
    }
  };

  const handleInputClick = () => {
    if (!searchMode) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setHighlightedIndex(-1);
      }
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
    return () => {
      debounceMap.clear(debounceKeyRef.current);
    };
  }, []);

  const getDisplayText = () => {
    if (searchMode) return searchTerm;

    if (isMulti) {
      return selectedValue.length > 0 ? `${selectedValue.length} selected` : "";
    } else {
      if (selectedValue != null) {
        const selectedItem = tableValues.find(
          (item) => getOptionValue(item) === selectedValue
        );
        return selectedItem ? getOptionLabel(selectedItem) : "";
      }
      return "";
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex flex-col w-full">
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayText()}
            onChange={handleSearchChange}
            onClick={handleInputClick}
            placeholder={placeholder}
            className={`h-11 w-full ${
              !searchMode ? "cursor-pointer" : ""
            } rounded-lg border border-gray-300 bg-transparent px-4 pr-24 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-600 ${className}`}
            onKeyDown={(e) => {
              if (!isOpen && ["Enter", " ", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                setIsOpen(true);
                setHighlightedIndex(0);
              } else if (isOpen) {
                switch (e.key) {
                  case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                      prev < tableValues.length - 1 ? prev + 1 : 0
                    );
                    break;
                  case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                      prev > 0 ? prev - 1 : tableValues.length - 1
                    );
                    break;
                  case "Enter":
                    e.preventDefault();
                    if (isOpen) {
                      if (
                        highlightedIndex >= 0 &&
                        tableValues[highlightedIndex]
                      ) {
                        handleOptionSelect(tableValues[highlightedIndex]);
                      } else if (tableValues.length > 0) {
                        handleOptionSelect(tableValues[0]);
                      }
                    }
                    break;
                  case "Escape":
                    setIsOpen(false);
                    setSearchTerm("");
                    setSearchMode(false);
                    setHighlightedIndex(-1);
                    break;
                }
              }
            }}
            autoComplete="off"
            readOnly={!searchMode}
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-1">
            {allowClear &&
              ((isMulti && selectedValue.length > 0) ||
                (!isMulti && selectedValue != null)) && (
                <div
                  className="flex items-center cursor-pointer pointer-events-auto"
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
              className="flex items-center cursor-pointer pointer-events-auto"
              onClick={handleSearchToggle}
              title={searchMode ? "Hide search" : "Search"}
            >
              <svg
                className={`w-4 h-4 transition ${
                  searchMode
                    ? "text-blue-600 dark:text-blue-400"
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
              <ChevronDown
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        {isMulti && selectedValue.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedValue.map((val: any) => {
              const item = tableValues.find((o) => getOptionValue(o) === val);
              if (!item) return null;

              return (
                <div
                  key={val}
                  className="flex items-center max-w-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full px-2 py-0.5 text-sm overflow-hidden"
                >
                  <span className="truncate">{getOptionLabel(item)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSelected = selectedValue.filter(
                        (v: any) => v !== val
                      );
                      setSelectedValue(newSelected);
                      onChange(newSelected);
                    }}
                    className="ml-1 flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg max-h-60 overflow-auto scrollbar-thin shadow-lg ${
            dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div ref={optionsRef}>
            {isLoading && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            )}

            {!isLoading && tableValues.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No options found
              </div>
            )}

            {tableValues.map((item, index) => {
              const itemValue = getOptionValue(item);
              const isSelected = isMulti
                ? selectedValue.includes(itemValue)
                : selectedValue === itemValue;
              const isHighlighted = highlightedIndex === index;

              return (
                <div
                  key={`${itemValue}-${index}`}
                  className={`px-4 py-2 text-sm cursor-pointer border-b transition-colors duration-150 ${
                    isHighlighted
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : isSelected
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 text-gray-700"
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleOptionSelect(item)}
                >
                  {getOptionLabel(item)}
                  {isSelected && (
                    <svg
                      className="inline-block w-4 h-4 ml-2 text-blue-600 dark:text-blue-400"
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
            })}
          </div>

          {currentPage < totalPages && (
            <div
              ref={observerRef}
              className="w-full py-2 flex justify-center text-sm text-gray-500 dark:text-gray-400"
            >
              {isLoading && "Loading..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}