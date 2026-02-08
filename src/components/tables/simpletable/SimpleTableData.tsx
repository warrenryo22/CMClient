import React from "react";

interface Props {
  children: React.ReactNode;
  tdClass?: string;
  colSpan?: number;
}

export default function SimpleTableData({ children, tdClass, colSpan }: Props) {
  return (
    <td
      colSpan={colSpan}
      className={`px-5 py-3 text-sm text-gray-500 dark:text-gray-400 ${tdClass}`}
    >
      {children}
    </td>
  );
}
