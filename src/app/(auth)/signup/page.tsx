import SignUpForm from "./signup-form";
import AuthHeader from "../auth-header";
import AuthFooter from "../auth-footer";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";

import Social from "../social";

export default async function SignUpPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }
  const { session, user } = await getCurrentSession();
  if (session !== null) {
    if (!user.emailVerified) {
      return redirect("/verify-email");
    }
    return redirect("/admin");
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <AuthHeader heading="Sign in to your account" />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignUpForm />
        <Social />
        <AuthFooter
          text="Already have an account?"
          linkText="Sign In"
          link="/signin"
        />
      </div>
    </div>
  );
}
