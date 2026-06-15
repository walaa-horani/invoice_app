"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateInvoiceAction } from "@/actions/invoice";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { InvoiceFormInput, InvoiceRow } from "@/types/invoice";

interface EditFormClientProps {
  invoice: InvoiceRow;
}

export function EditFormClient({ invoice }: EditFormClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: InvoiceFormInput) => {
    await updateInvoiceAction(invoice.id, data);
    router.push(`/invoices/${invoice.id}`);
  };

  return <InvoiceForm initialData={invoice} onSubmit={handleSubmit} />;
}
