import { FilterTimeIntervals } from "@/enums/commons";
import { Dispatch, SetStateAction } from "react";

interface PeriodFilterProps {
  setSelectedPeriod: Dispatch<SetStateAction<FilterTimeIntervals>>;
  selectedPeriod: FilterTimeIntervals;
  loading: boolean;
}

const PeriodFilter = ({
  setSelectedPeriod,
  selectedPeriod,
  loading
}: PeriodFilterProps) => {
  const periods = Object.values(FilterTimeIntervals).filter(
    (v): v is FilterTimeIntervals => typeof v === "number",
  );
  return (
    <div className="">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          Period:
        </span>
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            disabled={loading}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedPeriod === period
                ? "bg-sky-700 text-white shadow-theme-sm"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {FilterTimeIntervals[period]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PeriodFilter;
