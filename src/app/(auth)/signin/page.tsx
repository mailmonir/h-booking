import AuthFooter from "../auth-footer";
import AuthHeader from "../auth-header";
import Social from "../social";
import SignInForm from "./signin-form";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/session";
import { globalGETRateLimit } from "@/lib/server/request";

export default async function SignInPage() {
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
        <SignInForm />
        <Social />
        <AuthFooter
          text="Don't have an account? "
          linkText="Sign Up"
          link="/signup"
        />
      </div>
    </div>
  );
}
