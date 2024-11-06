"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signupSchema, SignupSchemaType } from "@/app/(auth)/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { ResponseType } from "@/lib/types";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/lib/server/email-verification";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { headers } from "next/headers";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { hashPassword } from "@/lib/server/password";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function signUp(
  credential: SignupSchemaType
): Promise<ResponseType> {
  try {
    if (!(await globalPOSTRateLimit())) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    const headersObj = await headers();
    const clientIP = headersObj.get("X-Forwarded-For");
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    const validatedSignupData = signupSchema.safeParse(credential);

    if (!validatedSignupData.success) {
      return {
        type: "error",
        message: validatedSignupData.error.issues,
      };
    }

    const { name, email, password } = validatedSignupData.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log(existingUser !== null && existingUser.providerId === "user");

    if (existingUser !== null && existingUser.providerId === "user") {
      return { type: "error", message: "Email already exists" };
    }

    if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      create: {
        name,
        email,
        passwordHash,
        emailVerified: false,
        providerId: "user",
      },
      update: {
        name,
        passwordHash,
      },
    });

    const emailVerificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email
    );

    const emailSent = await sendVerificationEmail(
      emailVerificationRequest.email,
      emailVerificationRequest.code
    );

    if (!emailSent) {
      await prisma.user.delete({ where: { id: user.id } });
      return {
        type: "error",
        message:
          "There was a problem creating your account. Please try again later.",
      };
    }

    await setEmailVerificationRequestCookie(emailVerificationRequest);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return redirect("/verify-email");
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong. Please try again later.",
    };
  }
}
