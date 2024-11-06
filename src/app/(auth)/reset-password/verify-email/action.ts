"use server";
import { verifySchema } from "@/app/(auth)/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { ResponseType } from "@/lib/types";
import {
  setPasswordResetSessionAsEmailVerified,
  validatePasswordResetSessionRequest,
} from "@/lib/server/password-reset";
import { ExpiringTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { setUserAsEmailVerifiedIfEmailMatches } from "@/lib/server/user";

const emailVerificationBucket = new ExpiringTokenBucket<string>(5, 60 * 30);

interface VerifyPasswordResetEmailProps {
  code: string;
}

export async function verifyPasswordResetEmail(
  credential: VerifyPasswordResetEmailProps
): Promise<ResponseType> {
  try {
    if (!globalPOSTRateLimit()) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    const { session } = await validatePasswordResetSessionRequest();
    if (session === null) {
      return {
        type: "error",
        message: "Not authenticated",
      };
    }
    if (session.emailVerified) {
      return {
        type: "error",
        message: "Forbidden",
      };
    }
    if (!emailVerificationBucket.check(session.userId, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    const validatedData = verifySchema.safeParse(credential);

    if (!validatedData.success) {
      return {
        type: "error",
        message: validatedData.error.issues,
      };
    }
    const { code } = validatedData.data;

    if (!emailVerificationBucket.consume(session.userId, 1)) {
      return { type: "error", message: "Too many requests" };
    }
    if (code !== session.code) {
      return {
        type: "error",
        message: "Incorrect code",
      };
    }
    emailVerificationBucket.reset(session.userId);
    await setPasswordResetSessionAsEmailVerified(session.id);
    const emailMatches = await setUserAsEmailVerifiedIfEmailMatches(
      session.userId,
      session.email
    );
    if (!emailMatches) {
      return {
        type: "error",
        message: "Please restart the process",
      };
    }
    return redirect("/reset-password");
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
