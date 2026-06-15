import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "default";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide print:bg-white print:text-black print:border-black print:border print:rounded-md",
        {
          "bg-green-100 text-green-800 border border-green-200": variant === "success",
          "bg-yellow-100 text-yellow-800 border border-yellow-200": variant === "warning",
          "bg-red-100 text-red-800 border border-red-200": variant === "error",
          "bg-gray-100 text-gray-800 border border-gray-200": variant === "default",
        },
        className
      )}
      {...props}
    />
  );
}
