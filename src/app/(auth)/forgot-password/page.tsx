import AuthFooter from "../auth-footer";
import AuthHeader from "../auth-header";
import ForgotPassForm from "./forgot-pass-form";
import { globalGETRateLimit } from "@/lib/server/request";

export default function ForgotPasswordPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <AuthHeader heading="Forgot password?" />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ForgotPassForm />
        <AuthFooter text="Back to " linkText="Sign In" link="/signin" />
      </div>
    </div>
  );
}
