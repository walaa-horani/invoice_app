import { Database } from "./database.types";

export type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceStatus = InvoiceRow["status"];

export interface InvoiceFormInput {
  client_name: string;
  client_email: string;
  status: InvoiceStatus;
  total_amount: number;
  due_date: string;
}

export interface ProfileInput {
  full_name: string;
  email: string;
}
