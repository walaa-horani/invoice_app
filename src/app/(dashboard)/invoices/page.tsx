import * as React from "react";
import Link from "next/link";
import { getInvoices } from "@/actions/invoice";

export const dynamic = "force-dynamic";
import { InvoiceTable } from "@/components/invoice/invoice-table";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <Receipt className="w-4 h-4" />
            <span>Manage Invoices</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">List, review, edit, and delete all client transactions here.</p>
        </div>
        <Link href="/invoices/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <InvoiceTable invoices={invoices} />
      </div>
    </div>
  );
}
