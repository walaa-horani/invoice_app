"use client";

import * as React from "react";
import { InvoiceFormInput, InvoiceRow } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface InvoiceFormProps {
  initialData?: InvoiceRow;
  onSubmit: (data: InvoiceFormInput) => Promise<void>;
}

export function InvoiceForm({ initialData, onSubmit }: InvoiceFormProps) {
  const [formData, setFormData] = React.useState<InvoiceFormInput>({
    client_name: initialData?.client_name || "",
    client_email: initialData?.client_email || "",
    status: initialData?.status || "PENDING",
    total_amount: initialData?.total_amount || 0.0,
    due_date: initialData?.due_date
      ? new Date(initialData.due_date).toISOString().split("T")[0]
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // defaults to 7 days from now
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const validate = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!formData.client_name.trim()) tempErrors.client_name = "Client name is required";
    if (!formData.client_email.trim()) {
      tempErrors.client_email = "Client email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.client_email)) {
      tempErrors.client_email = "Invalid email format";
    }
    if (formData.total_amount < 0) tempErrors.total_amount = "Amount must be greater than or equal to 0";
    if (!formData.due_date) tempErrors.due_date = "Due date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError(null);
    startTransition(async () => {
      try {
        await onSubmit(formData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save invoice.";
        setServerError(message);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total_amount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
      {serverError && (
        <div className="p-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="client_name"
          label="Client Name"
          placeholder="Acme Corp"
          value={formData.client_name}
          onChange={handleChange}
          error={errors.client_name}
          disabled={isPending}
          required
        />

        <Input
          name="client_email"
          type="email"
          label="Client Email"
          placeholder="billing@acme.com"
          value={formData.client_email}
          onChange={handleChange}
          error={errors.client_email}
          disabled={isPending}
          required
        />

        <Input
          name="total_amount"
          type="number"
          step="0.01"
          min="0"
          label="Total Amount ($)"
          placeholder="0.00"
          value={formData.total_amount}
          onChange={handleChange}
          error={errors.total_amount}
          disabled={isPending}
          required
        />

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isPending}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <Input
          name="due_date"
          type="date"
          label="Due Date"
          value={formData.due_date}
          onChange={handleChange}
          error={errors.due_date}
          disabled={isPending}
          required
        />
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <Link href="/invoices">
          <Button variant="outline" className="flex items-center gap-2" disabled={isPending}>
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
        </Link>
        <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={isPending}>
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving..." : "Save Invoice"}</span>
        </Button>
      </div>
    </form>
  );
}
