import React from "react";

interface Props {
  children: React.ReactNode;
  thClass?: string;
}

export default function TableHead({ children, thClass }: Props) {
  return (
    <th
      className={`
        px-4 py-3 text-gray-200 font-medium text-xs uppercase  dark:text-gray-400
        text-center whitespace-nowrap hidden sm:table-cell
        ${thClass ?? ""}
      `}
    >
      {children}
    </th>
  );
}
