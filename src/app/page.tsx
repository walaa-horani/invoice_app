import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Shield, Database, Layout } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Invoicely
            </span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="border-slate-800 text-slate-300 bg-slate-950 hover:bg-slate-900 hover:text-white">
              Log In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-semibold text-blue-400">
          <span>Powered by Next.js 16 & Supabase</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Manage invoices and get paid,{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            without the hassle.
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-light">
          A secure, lightning-fast platform designed for freelancers and small businesses. Generate, send, and audit invoices directly with automated dashboard insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/login">
            <Button className="w-full sm:w-auto h-12 px-8 text-base bg-blue-600 hover:bg-blue-500 flex items-center gap-2 shadow-lg shadow-blue-500/25">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="border-t border-slate-800 bg-slate-950/30 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Route Group Separation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Protected pages are securely organized under the <code>(dashboard)</code> route grouping, allowing shared layouts and clean URLs.
            </p>
          </div>
          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Supabase Integration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Secure database connections via Next.js Server Actions. Seamless data syncing backed by PostgreSQL Row Level Security.
            </p>
          </div>
          <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Security Proxy Guard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Strict session validation using route-guarding proxies to prevent parameter tampering and unauthorized accesses.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Invoicely. All rights reserved.</p>
      </footer>
    </main>
  );
}
