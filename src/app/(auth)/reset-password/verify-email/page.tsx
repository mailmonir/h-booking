import AuthFooter from "../../auth-footer";
import AuthHeader from "../../auth-header";
import PassResetEmailVerifyForm from "./pass-reset-email-verify-form";
import { validatePasswordResetSessionRequest } from "@/lib/server/password-reset";
import { globalGETRateLimit } from "@/lib/server/request";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }
  const { session } = await validatePasswordResetSessionRequest();
  if (session === null) {
    return redirect("/forgot-password");
  }
  if (session.emailVerified) {
    // if (!session.twoFactorVerified) {
    //   return redirect("/reset-password/2fa");
    // }
    return redirect("/reset-password");
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <AuthHeader heading="Verify your email address" />
      <p className="text-center text-sm text-muted-foreground mt-2">
        We sent an 8-digit code to {session?.email}.
      </p>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <PassResetEmailVerifyForm />
        <AuthFooter text="Back to " linkText="Sign In" link="/signin" />
      </div>
    </div>
  );
}
