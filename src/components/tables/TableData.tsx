import React from "react";

interface Props {
  children: React.ReactNode;
  label?: string;
  tdClass?: string;
  highlight?: boolean;
}

export default function TableData({
  children,
  label = "Item",
  tdClass,
  highlight,
}: Props) {
  return (
    <td
      className={`
        relative sm:px-4 sm:py-3 sm:border text-gray-900 text-center whitespace-nowrap font-normal text-sm block sm:table-cell sm:text-center align-center dark:text-gray-300 ${tdClass} ${
        highlight
          ? `bg-sky-600 dark:bg-unicorp-blue/50 text-sky-800 dark:text-gray-400 sm:bg-transparent sm:dark:bg-transparent sm:text-sky-600 sm:dark:text-gray-300!`
          : ""
      }`}
      data-label={label}
    >
      {/* Mobile view */}
      <div className="px-5 py-3 uppercase flex justify-between items-center sm:hidden font-medium border-b-2">
        <span>{label}</span>
        <span>{children}</span>
      </div>

      {/* Desktop view */}
      <span className="hidden sm:inline">{children}</span>
    </td>
  );
}
