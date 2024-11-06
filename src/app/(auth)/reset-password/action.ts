"use server";
import { resetPassSchema } from "@/app/(auth)/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { ResponseType } from "@/lib/types";
import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  deletePasswordResetSessionTokenCookie,
  invalidateUserPasswordResetSessions,
  validatePasswordResetSessionRequest,
} from "@/lib/server/password-reset";
import {
  createSession,
  generateSessionToken,
  invalidateUserSessions,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { updateUserPassword } from "@/lib/server/user";

interface ResetPassProps {
  password: string;
  passwordConfirmation: string;
}

export async function resetPassword(
  credential: ResetPassProps
): Promise<ResponseType> {
  try {
    if (!globalPOSTRateLimit()) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    const { session: passwordResetSession, user } =
      await validatePasswordResetSessionRequest();
    if (passwordResetSession === null) {
      return {
        type: "error",
        message: "Not authenticated",
      };
    }
    if (!passwordResetSession.emailVerified) {
      return {
        type: "error",
        message: "Forbidden",
      };
    }

    const validateResetPass = resetPassSchema.safeParse(credential);

    if (!validateResetPass.success) {
      return {
        type: "error",
        message: validateResetPass.error.message,
      };
    }

    const { password } = validateResetPass.data;

    await invalidateUserPasswordResetSessions(passwordResetSession.userId);
    await invalidateUserSessions(passwordResetSession.userId);
    await updateUserPassword(passwordResetSession.userId, password);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    await deletePasswordResetSessionTokenCookie();
    return redirect("/admin");
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Unexpected error occurred. Please try again later.",
    };
  }
}
