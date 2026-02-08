import React from "react";

interface Props {
  children: React.ReactNode;
  thClass?: string;
}

export default function SimpleTableHead({ children, thClass }: Props) {
  return (
    <th
      className={`px-5 py-3 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400${thClass}`}
    >
      {children}
    </th>
  );
}
