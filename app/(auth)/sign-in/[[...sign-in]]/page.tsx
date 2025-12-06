import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-3xl font-black text-red">
            RedTape
          </Link>
          <div className="text-sm text-base-content/70">
            New here?{" "}
            <Link href="/sign-up" className="link link-primary">
              Create an account
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="badge badge-primary badge-lg text-sm">
              Sign in
            </div>
            <h1 className="text-3xl font-bold leading-tight">
              Welcome back to RedTape
            </h1>
            <p className="text-base-content/70">
              Access your universal assistant, portfolios, and compliance
              checklists. We will take you straight to the dashboard after you
              log in.
            </p>
            <ul className="space-y-2 text-base-content/80">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Secure session managed by Clerk
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Continue where you left off in chat and checklists
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Switch accounts anytime from Settings
              </li>
            </ul>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-6">
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              afterSignInUrl="/dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
