import * as React from "react";
import { getInvoiceById } from "@/actions/invoice";
import { EditFormClient } from "./edit-form-client";
import { Receipt } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <Receipt className="w-4 h-4" />
          <span>Edit Invoice</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
          Modify Invoice
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Make adjustments to client invoice #{invoice.id.slice(0, 8)}.
        </p>
      </div>

      <EditFormClient invoice={invoice} />
    </div>
  );
}
