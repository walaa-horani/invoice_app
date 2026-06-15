import * as React from "react";
import { getProfile } from "@/actions/profile";

export const dynamic = "force-dynamic";
import { ProfileFormClient } from "./profile-form-client";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your public merchant details and billing information.</p>
      </div>

      <ProfileFormClient profile={profile} />
    </div>
  );
}
