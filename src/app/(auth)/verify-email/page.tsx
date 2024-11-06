import VerifyForm, { ResendVerificationCode } from "./verify-form";
import AuthHeader from "../auth-header";
import AuthFooter from "../auth-footer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentSession } from "@/lib/server/session";
import { getUserEmailVerificationRequestFromRequest } from "@/lib/server/email-verification";
import { globalGETRateLimit } from "@/lib/server/request";
import { VerifyEmailProvider } from "@/context/verify-email-context";

export default async function VerifyPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/signin");
  }

  // TODO: Ideally we'd sent a new verification email automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest =
    await getUserEmailVerificationRequestFromRequest();
  if (verificationRequest === null && user?.emailVerified) {
    return redirect("/admin");
  }

  return (
    <VerifyEmailProvider>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <AuthHeader heading="Verify your email address" />
        <p className="text-center text-sm text-muted-foreground mt-2">
          We sent an 8-digit code to {verificationRequest?.email ?? user?.email}
          .
        </p>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <VerifyForm />
          <ResendVerificationCode />
          <Link
            href="/settings"
            className="text-xs text-muted-foreground text-center block mt-6 hover:text-foreground"
          >
            Change your email
          </Link>
          <AuthFooter text="Go back to  " linkText="Sign In" link="/signin" />
        </div>
      </div>
    </VerifyEmailProvider>
  );
}
