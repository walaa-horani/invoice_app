import * as React from "react";
import Link from "next/link";
import { getInvoices } from "@/actions/invoice";

export const dynamic = "force-dynamic";
import { InvoiceTable } from "@/components/invoice/invoice-table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Receipt, DollarSign, Clock, CheckCircle, Plus } from "lucide-react";

export default async function DashboardPage() {
  const invoices = await getInvoices();

  // Metrics calculation
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === "PAID");
  const pendingInvoices = invoices.filter((i) => i.status === "PENDING");
  const overdueInvoices = invoices.filter((i) => i.status === "OVERDUE");

  const totalPaidAmount = paidInvoices.reduce((sum, i) => sum + Number(i.total_amount), 0);
  const totalPendingAmount = pendingInvoices.reduce((sum, i) => sum + Number(i.total_amount), 0);
  const totalOverdueAmount = overdueInvoices.reduce((sum, i) => sum + Number(i.total_amount), 0);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Here is a summary of your financial metrics and invoices.</p>
        </div>
        <Link href="/invoices/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total revenue (PAID) */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaidAmount)}</div>
            <p className="text-xs text-gray-500 mt-1">{paidInvoices.length} fully paid invoices</p>
          </CardContent>
        </Card>

        {/* Outstanding (PENDING) */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Pending Payments
            </CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPendingAmount)}</div>
            <p className="text-xs text-gray-500 mt-1">{pendingInvoices.length} pending invoices</p>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Overdue Balances
            </CardTitle>
            <Clock className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalOverdueAmount)}</div>
            <p className="text-xs text-gray-500 mt-1">{overdueInvoices.length} unpaid late invoices</p>
          </CardContent>
        </Card>

        {/* Invoice Count */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Invoices
            </CardTitle>
            <Receipt className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalInvoices}</div>
            <p className="text-xs text-gray-500 mt-1">Generated transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices Table */}
      <Card className="border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Recent Invoices</CardTitle>
            <CardDescription>A list of your latest invoice transactions.</CardDescription>
          </div>
          <Link href="/invoices">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={invoices.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
}
