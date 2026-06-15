"use client";

import * as React from "react";
import Link from "next/link";
import { InvoiceRow } from "@/types/invoice";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { deleteInvoiceAction } from "@/actions/invoice";
import { Trash2, Edit, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceTableProps {
  invoices: InvoiceRow[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    setError(null);
    startTransition(async () => {
      try {
        await deleteInvoiceAction(id);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete invoice.";
        setError(message);
      }
    });
  };

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 rounded-xl">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-950">No invoices found</h3>
        <p className="text-sm text-gray-500 mt-1">Get started by creating your first client invoice.</p>
        <Link href="/invoices/new" className="mt-4">
          <Button variant="primary">Create Invoice</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="p-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Issue Date</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{invoice.client_name}</div>
                  <div className="text-xs text-gray-500">{invoice.client_email}</div>
                </td>
                <td className="px-6 py-4">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="px-6 py-4">{formatDate(invoice.issue_date)}</td>
                <td className="px-6 py-4">{formatDate(invoice.due_date)}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  {formatCurrency(invoice.total_amount)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/invoices/${invoice.id}`} title="View">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </Button>
                    </Link>
                    <Link href={`/invoices/${invoice.id}/edit`} title="Edit">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-red-200 hover:bg-red-50"
                      disabled={isPending}
                      onClick={() => handleDelete(invoice.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
