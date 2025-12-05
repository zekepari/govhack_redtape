"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Shield, LogOut, RefreshCcw, Home } from "lucide-react";
import { usePortfolio } from "../contexts/PortfolioContext";

export default function SettingsPage() {
  const { user } = useUser();
  const { resetAll } = usePortfolio();

  return (
    <div className="min-h-screen bg-base-200">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-base-100 border border-base-300 p-6 rounded-xl shadow-lg space-y-3 max-w-md w-full mx-3">
            <h1 className="text-xl font-semibold">RedTape Settings</h1>
            <p className="text-sm text-base-content/70">
              Please sign in to view and manage your account settings.
            </p>
            <SignInButton mode="modal">
              <button className="btn btn-primary w-full">Sign in</button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-base-content/60">
                  Account Settings
                </p>
                <h1 className="text-2xl font-semibold">RedTape Profile</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <SignOutButton redirectUrl="/">
                <button className="btn btn-outline btn-sm">
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </SignOutButton>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-4">
            <h2 className="text-lg font-semibold">Clerk Account</h2>
            <div className="text-sm text-base-content/80 space-y-1">
              <p>
                <span className="font-medium">Email:</span>{" "}
                {user?.primaryEmailAddress?.emailAddress || "Unknown"}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {user?.id}
              </p>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-semibold">Reset profile & checklist</h3>
                <p className="text-sm text-base-content/70">
                  Clears local profile, roles, and universal checklist stored in your browser.
                </p>
              </div>
              <button
                className="btn btn-error btn-sm"
                onClick={() => {
                  if (
                    confirm(
                      "This will clear your local profile and checklist data. Proceed?"
                    )
                  ) {
                    resetAll();
                  }
                }}
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
