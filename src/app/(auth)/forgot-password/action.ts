"use server";

import prisma from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";
import { forgotPassSchema } from "@/app/(auth)/schema";
import {
  createPasswordResetSession,
  invalidateUserPasswordResetSessions,
  sendPasswordResetEmail,
  setPasswordResetSessionTokenCookie,
} from "@/lib/server/password-reset";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { generateSessionToken } from "@/lib/server/session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResponseType } from "@/lib/types";

const passwordResetEmailIPBucket = new RefillingTokenBucket<string>(3, 60);
const passwordResetEmailUserBucket = new RefillingTokenBucket<string>(3, 60);

export async function forgotPassowrd(credential: {
  email: string;
}): Promise<ResponseType> {
  try {
    if (!globalPOSTRateLimit()) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    // TODO: Assumes X-Forwarded-For is always included.
    const headerObj = await headers();
    const clientIP = headerObj.get("X-Forwarded-For");

    if (clientIP !== null && !passwordResetEmailIPBucket.check(clientIP, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    const validatedData = forgotPassSchema.safeParse(credential);

    if (!validatedData.success) {
      return {
        type: "error",
        message: validatedData.error.issues,
      };
    }

    const { email } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log(user);

    if (!user) {
      return {
        type: "error",
        message: "Invalid email",
      };
    }

    if (clientIP !== null && !passwordResetEmailIPBucket.consume(clientIP, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    if (!passwordResetEmailUserBucket.consume(user.id, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    await invalidateUserPasswordResetSessions(user.id);
    console.log("hello");
    const sessionToken = generateSessionToken();
    console.log("hellos");
    const session = await createPasswordResetSession(
      sessionToken,
      user.id,
      user.email
    );

    console.log(console.log("helloss"));

    await sendPasswordResetEmail(session.email, session.code);
    await setPasswordResetSessionTokenCookie(sessionToken, session.expiresAt);
    return redirect("/reset-password/verify-email");
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
