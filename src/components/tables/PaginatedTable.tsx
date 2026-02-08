import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  RefreshCw,
  CloudUpload,
  Sheet,
  File,
  Filter,
  X,
  CloudDownload,
} from "lucide-react";
import { usePaginatedTable } from "../../hooks/usePaginatedTable";
import IconButton from "../buttons/IconButton";
import Spinner from "../loadings/Spinner";
import Pagination from "./Pagination";



export type FilterConfig = Array<
  "role" | "branch" | "supplier" | "brand" | "category" | "tag" | "DateFilter"
>;

interface PaginatedTableProps<T> {
  children: React.ReactNode;
  title: string;
  filterConfig?: FilterConfig;
  usePaginated: ReturnType<typeof usePaginatedTable<T>>;
}

export default function PaginatedTable<T>({
  children,
  // title,
  filterConfig,
  usePaginated,
}: PaginatedTableProps<T>) {
  const [actualColSpan, setActualColSpan] = useState<number>(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [inputBuffer, setInputBuffer] = useState("");

  const isFirstRender = useRef(true);

  const containerRef = useRef<HTMLButtonElement | null>(null);

  let headerChildren: React.ReactNode = null;
  let bodyChildren: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === "thead") {
      headerChildren = child;
    } else if (child.type === "tbody") {
      bodyChildren = child;
    }
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    usePaginated.handleSearchValueChange(inputBuffer);
  }, [inputBuffer]);

  useEffect(() => {
    if (!React.isValidElement(headerChildren)) return;

    const headerElement = headerChildren as React.ReactElement<{
      children: React.ReactNode;
    }>;

    let headerCount = 0;

    React.Children.forEach(headerElement.props.children, (tr) => {
      if (!React.isValidElement(tr)) return;

      const trElement = tr as React.ReactElement<{ children: React.ReactNode }>;
      headerCount += React.Children.count(trElement.props.children);
    });

    setActualColSpan(headerCount);
  }, [headerChildren]);

  const handleInputBlur = () => {
    usePaginated.handleSearchValueChange(inputBuffer, true);
  };

  return (
    <div className="mt-10  overflow-hidden max-w-full ">
      {/* Table Header */}

      <div className="">
        {/* <div className="block">
          <h4 className="text-xs font-semibold text-unicorp-text uppercase">
            {title} LOGS
          </h4>

          <p className="mt-1 text-xs text-unicorp-text uppercase">
            This is your data for {title}.
          </p>
        </div> */}
        <div className="flex gap-2">
          {filterConfig && (
            <>
              <button
                ref={containerRef}
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex gap-1 items-center table-icon relative"
                style={{ width: "fit-content", padding: "0 10px" }}
              >
                <Filter size={16} />
                <span className="text-sm">Filters</span>

                {usePaginated.activeFilterCount > 0 && (
                  <span className="absolute -right-1 -top-2 items-center justify-center w-4 h-4 text-xs text-white bg-unicorp-red rounded-full">
                    {usePaginated.activeFilterCount}
                  </span>
                )}
              </button>
              {filterOpen &&
                createPortal(
                  <>
                    <div
                      className="fixed inset-0 z-[999] bg-black/30"
                      onClick={() => setFilterOpen(false)}
                    />
                    <div
                      className="fixed z-[999] w-full md:w-96 rounded-lg bg-white dark:bg-gray-800 p-5"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-unicorp-text text-sm">
                          Filter Options
                        </h3>
                        <button
                          onClick={() => setFilterOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-end">
                          <button
                            onClick={usePaginated.handleClearFilter}
                            className="flex gap-1 items-center text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            <X size={14} />
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </>,
                  document.body
                )}
            </>
          )}

          {usePaginated.handleSync && (
            <IconButton
              icon={() =>
                usePaginated.syncLoading ? (
                  <Spinner />
                ) : (
                  <RefreshCw size={18} strokeWidth={1.5} />
                )
              }
              addedClass="table-icon"
              tooltipTitle="Sync employee face data"
              isLoading={usePaginated.syncLoading}
              onClick={usePaginated.handleSync}
              disabled={usePaginated.syncLoading}
            />
          )}
          {usePaginated.handleSyncProductsClick && (
            <IconButton
              icon={() =>
                usePaginated.syncProductsLoading ? (
                  <Spinner />
                ) : (
                  <CloudDownload size={18} strokeWidth={1.5} />
                )
              }
              addedClass="table-icon"
              tooltipTitle="Import warehouse products"
              isLoading={usePaginated.syncProductsLoading}
              onClick={usePaginated.handleSyncProductsClick}
              disabled={usePaginated.syncProductsLoading}
            />
          )}
          {usePaginated.handleImport && (
            <IconButton
              icon={() => <CloudUpload size={18} strokeWidth={1.5} />}
              addedClass="table-icon"
              tooltipTitle="Import"
              isLoading={usePaginated.importLoading}
              onClick={usePaginated.handleImport}
              disabled={usePaginated.importLoading}
            />
          )}
          {usePaginated.handleExportExcel && (
            <IconButton
              icon={() => <Sheet size={18} strokeWidth={1.5} />}
              addedClass="table-icon"
              tooltipTitle="Export Excel"
              isLoading={usePaginated.exportExcelLoading}
              onClick={usePaginated.handleExportExcel}
              disabled={usePaginated.exportExcelLoading}
            />
          )}
          {usePaginated.handleExportPDF && (
            <IconButton
              icon={() => <File size={18} strokeWidth={1.5} />}
              addedClass="table-icon"
              tooltipTitle="Export PDF"
              isLoading={usePaginated.exportPDFLoading}
              onClick={usePaginated.handleExportPDF}
              disabled={usePaginated.exportPDFLoading}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-2 mb-4 sm:flex-row items-end md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-fit">
          <div className="relative">
            <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
              <Search size={19} />
            </button>
            <input
              type="text"
              x-model="search"
              placeholder="Search..."
              value={inputBuffer}
              onChange={(e) => setInputBuffer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInputBlur();
                }
              }}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12.5px]">
          <span className="text-gray-500 dark:text-gray-400"> Show </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="w-full py-2 pl-3 pr-8 text-[12.5px] text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={usePaginated.rowsPerPage}
              onChange={usePaginated.handleRowsOnChange}
            >
              <option
                value="100"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                100
              </option>
              <option
                value="50"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                50
              </option>
              <option
                value="10"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                10
              </option>
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400"> entries </span>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto thin-scrollbar">
        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-white/[0.05]">
          {headerChildren}
          {usePaginated.isLoading ? (
            <tbody>
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonRow key={idx} cols={actualColSpan} />
              ))}
            </tbody>
          ) : usePaginated.totalEntries === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={actualColSpan}
                  className={`px-4 py-3 border text-unicorp-text text-center dark:border-white/[0.05] whitespace-nowrap font-normal text-sm`}
                >
                  NO RESULTS FOUND
                </td>
              </tr>
            </tbody>
          ) : (
            bodyChildren
          )}
        </table>
      </div>
      <div className="rounded-b-xl py-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          <div className="pb-3 xl:pb-0">
            <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
              Showing {usePaginated.startIndex + 1} to {usePaginated.endIndex}{" "}
              of {usePaginated.totalEntries} entries
            </p>
          </div>
          {usePaginated.totalEntries > 0 && (
            <Pagination
              currentPage={usePaginated.currentPage}
              totalPages={usePaginated.totalPages}
              onPageChange={usePaginated.onPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const SkeletonRow = ({ cols }: { cols: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, idx) => (
      <td key={idx} className="px-4 py-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </td>
    ))}
  </tr>
);
