"use client"

import { CheckupStatus } from "@/types/checkup"

interface StatusIndicatorProps {
  status: CheckupStatus
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const isCompleted = status === "completed"

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
        isCompleted
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      <span
        className={[
          "h-2.5 w-2.5 rounded-full",
          isCompleted
            ? "bg-emerald-500"
            : "bg-amber-500 animate-pulse",
        ].join(" ")}
      />
      {isCompleted ? "Checkup Completed" : "Checkup in Progress"}
    </div>
  )
}
