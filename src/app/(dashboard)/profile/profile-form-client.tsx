"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, CheckCircle } from "lucide-react";

interface ProfileFormClientProps {
  profile: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export function ProfileFormClient({ profile }: ProfileFormClientProps) {
  const router = useRouter();
  const [fullName, setFullName] = React.useState(profile.full_name || "");
  const [email, setEmail] = React.useState(profile.email || "");
  const [isPending, startTransition] = React.useTransition();
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    startTransition(async () => {
      try {
        await updateProfile({ full_name: fullName, email });
        setSuccess(true);
        router.refresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to update profile.";
        setError(message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
      {error && (
        <div className="p-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          name="fullName"
          label="Full Name / Merchant Name"
          placeholder="Acme Corp"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isPending}
          required
        />

        <Input
          name="email"
          type="email"
          label="Billing / Contact Email"
          placeholder="billing@acme.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={isPending}>
          <Save className="w-4 h-4" />
          <span>{isPending ? "Saving..." : "Save Settings"}</span>
        </Button>
      </div>
    </form>
  );
}
