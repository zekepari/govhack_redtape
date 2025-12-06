import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-3xl font-black text-red">
            RedTape
          </Link>
          <div className="text-sm text-base-content/70">
            Already have an account?{" "}
            <Link href="/sign-in" className="link link-primary">
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="badge badge-secondary badge-lg text-sm">
              Sign up
            </div>
            <h1 className="text-3xl font-bold leading-tight">
              Create your RedTape account
            </h1>
            <p className="text-base-content/70">
              Set up access to the universal assistant, portfolio builder, and
              compliance tracking tools in a few clicks.
            </p>
            <ul className="space-y-2 text-base-content/80">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Personal and business-ready guidance
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Save contexts for chat and exportable checklists
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Switch between profiles anytime
              </li>
            </ul>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-6">
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              afterSignUpUrl="/dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
