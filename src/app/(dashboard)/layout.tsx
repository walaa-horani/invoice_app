import * as React from "react";
import Link from "next/link";
import { requireAuth } from "@/lib/proxy";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, Receipt, User, LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Enforces authentication check before loading any dashboard children pages
  const user = await requireAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col justify-between hidden md:flex print:hidden">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="font-extrabold text-xl tracking-tight text-gray-900">Invoicely</span>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/invoices"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Receipt className="w-4 h-4 text-gray-400" />
              <span>Invoices</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Card & Log Out */}
        <div className="p-6 border-t border-gray-100 space-y-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {user.email}
            </span>
            <span className="text-xs text-gray-500">Merchant Account</span>
          </div>
          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 md:justify-end print:hidden">
          <div className="flex items-center gap-2 md:hidden">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="font-extrabold text-lg tracking-tight text-gray-900">Invoicely</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="hidden md:inline font-medium">Logged in as {user.email}</span>
            <form action={signOut} className="md:hidden">
              <Button type="submit" variant="outline" size="sm" className="h-8 border-red-100 text-red-600 p-2">
                <LogOut className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </header>
        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
