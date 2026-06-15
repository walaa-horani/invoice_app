"use client";

import * as React from "react";
import { signIn, signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isSignUp) {
          const res = await signUp(formData);
          if (res?.error) {
            setError(res.error);
          } else if (res?.success) {
            setSuccess(res.success);
          }
        } else {
          const res = await signIn(formData);
          if (res?.error) {
            setError(res.error);
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md border-gray-200 shadow-md">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="font-extrabold text-2xl tracking-tight text-gray-900">Invoicely</span>
            </Link>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Start managing invoices by registering below"
              : "Welcome back! Please enter your details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            {isSignUp && (
              <Input
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                required
                disabled={isPending}
              />
            )}

            <Input
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              required
              disabled={isPending}
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full h-10 flex items-center justify-center gap-2 mt-2"
              disabled={isPending}
            >
              <span>{isPending ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
