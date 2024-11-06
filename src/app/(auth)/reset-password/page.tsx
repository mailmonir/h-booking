import AuthFooter from "@/app/(auth)/auth-footer";
import AuthHeader from "@/app/(auth)/auth-header";
import ResetPassForm from "./reset-pass-form";
import { validatePasswordResetSessionRequest } from "@/lib/server/password-reset";
import { globalGETRateLimit } from "@/lib/server/request";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  console.log("you came here");
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }
  const { session } = await validatePasswordResetSessionRequest();
  if (session === null) {
    return redirect("/forgot-password");
  }
  if (!session.emailVerified) {
    return redirect("/reset-password/verify-email");
  }
  // if (user.registered2FA && !session.twoFactorVerified) {
  //   return redirect("/reset-password/2fa");
  // }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <AuthHeader heading="Enter your new password" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ResetPassForm />
        <AuthFooter text="Back to " linkText="Sign In" link="/signin" />
      </div>
    </div>
  );
}
