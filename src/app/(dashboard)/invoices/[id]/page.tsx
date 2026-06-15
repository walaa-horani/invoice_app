import * as React from "react";
import Link from "next/link";
import { getInvoiceById } from "@/actions/invoice";
import { InvoiceStatusBadge } from "@/components/invoice/invoice-status-badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Printer, FileText, Calendar, Mail, User } from "lucide-react";

import { PrintButton } from "@/components/invoice/print-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Action Bar */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/invoices">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>All Invoices</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
          <Link href={`/invoices/${id}/edit`}>
            <Button variant="primary" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              <span>Edit Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Invoice Receipt Document Card */}
      <Card className="border-gray-200 overflow-hidden shadow-md print:shadow-none print:border-none bg-white">
        <CardHeader className="bg-slate-50 print:bg-white border-b border-gray-100 print:border-b-2 print:border-black p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-gray-900">Invoicely</span>
                <p className="text-xs text-gray-500">Merchant Account Services</p>
              </div>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Invoice Number</div>
              <div className="font-mono text-sm text-gray-900 font-bold">INV-{invoice.id.slice(0, 8).toUpperCase()}</div>
              <div className="mt-1">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Bill To & Metadata info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 print:text-black flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Billed To</span>
              </h4>
              <div className="space-y-1">
                <div className="text-base font-semibold text-gray-900">{invoice.client_name}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{invoice.client_email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 print:text-black flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Important Dates</span>
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Issued Date</div>
                  <div className="font-semibold text-gray-900">{formatDate(invoice.issue_date)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Due Date</div>
                  <div className="font-semibold text-gray-900">{formatDate(invoice.due_date)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Item Description */}
          <div className="border border-gray-200 print:border-black rounded-xl overflow-hidden mt-6">
            <table className="min-w-full divide-y divide-gray-200 print:divide-black text-left text-sm">
              <thead className="bg-gray-50 print:bg-white text-xs font-semibold uppercase text-gray-500 print:text-black print:border-b-2 print:border-black">
                <tr>
                  <th className="px-6 py-4">Item Description</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700 bg-white">
                <tr>
                  <td className="px-6 py-6 font-medium text-gray-900">
                    Professional consulting and development services
                  </td>
                  <td className="px-6 py-6 text-right font-mono">1.00</td>
                  <td className="px-6 py-6 text-right font-mono">{formatCurrency(invoice.total_amount)}</td>
                  <td className="px-6 py-6 text-right font-semibold text-gray-900 font-mono">
                    {formatCurrency(invoice.total_amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary totals */}
          <div className="flex justify-end pt-4">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-gray-500 print:text-black">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between text-gray-500 print:text-black">
                <span>Tax (0%)</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 print:border-black pt-3 text-base font-bold text-gray-900 print:text-black">
                <span>Total Due</span>
                <span className="font-mono text-lg text-blue-600 print:text-black font-extrabold">{formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-gray-100 p-6 flex flex-col items-center justify-center gap-1.5 text-xs text-gray-400">
          <p>Thank you for your business!</p>
          <p className="text-[10px]">Invoicely Secure Electronic Billing System</p>
        </CardFooter>
      </Card>
    </div>
  );
}
