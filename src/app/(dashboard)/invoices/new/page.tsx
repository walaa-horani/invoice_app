"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createInvoiceAction } from "@/actions/invoice";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { InvoiceFormInput } from "@/types/invoice";
import { Receipt } from "lucide-react";

export default function NewInvoicePage() {
  const router = useRouter();

  const handleSubmit = async (data: InvoiceFormInput) => {
    await createInvoiceAction(data);
    router.push("/invoices");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <Receipt className="w-4 h-4" />
          <span>New Invoice</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Create Invoice</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to generate a new client invoice.</p>
      </div>

      <InvoiceForm onSubmit={handleSubmit} />
    </div>
  );
}
