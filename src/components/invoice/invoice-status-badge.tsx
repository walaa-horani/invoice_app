import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/types/invoice";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const statusMap: Record<InvoiceStatus, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
    PAID: { label: "Paid", variant: "success" },
    PENDING: { label: "Pending", variant: "warning" },
    OVERDUE: { label: "Overdue", variant: "error" },
  };

  const config = statusMap[status] || { label: status, variant: "default" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
