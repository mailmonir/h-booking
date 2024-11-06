"use server";

import { verifySchema } from "@/app/(auth)/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { ResponseType } from "@/lib/types";
import { redirect } from "next/navigation";

import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getUserEmailVerificationRequestFromRequest,
  sendVerificationEmail,
  sendVerificationEmailBucket,
  setEmailVerificationRequestCookie,
} from "@/lib/server/email-verification";
import { invalidateUserPasswordResetSessions } from "@/lib/server/password-reset";
import { ExpiringTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { updateUserEmailAndSetEmailAsVerified } from "@/lib/server/user";

const bucket = new ExpiringTokenBucket<string>(5, 60 * 30);

export async function verifyEmail(credential: {
  code: string;
}): Promise<ResponseType> {
  try {
    if (!globalPOSTRateLimit()) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    const validateVerifyCode = verifySchema.safeParse(credential);
    if (!validateVerifyCode.success) {
      return {
        type: "error",
        message: validateVerifyCode.error.message,
      };
    }

    const { code } = validateVerifyCode.data;

    const { session, user } = await getCurrentSession();

    if (!session) {
      return {
        type: "error",
        message: "Not authenticated",
      };
    }
    if (!bucket.check(user.id, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    let verificationRequest =
      await getUserEmailVerificationRequestFromRequest();
    if (verificationRequest === null) {
      return {
        type: "error",
        message: "Not authenticated",
      };
    }

    if (!bucket.consume(user.id, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    if (Date.now() >= verificationRequest.expiresAt.getTime()) {
      verificationRequest = await createEmailVerificationRequest(
        verificationRequest.userId,
        verificationRequest.email
      );
      sendVerificationEmail(
        verificationRequest.email,
        verificationRequest.code
      );
      return {
        type: "error",
        message:
          "The verification code was expired. We sent another code to your inbox.",
      };
    }
    if (verificationRequest.code !== code) {
      return {
        type: "error",
        message: "Incorrect code.",
      };
    }
    await deleteUserEmailVerificationRequest(user.id);
    await invalidateUserPasswordResetSessions(user.id);
    await updateUserEmailAndSetEmailAsVerified(
      user.id,
      verificationRequest.email
    );
    await deleteEmailVerificationRequestCookie();
    return redirect("/admin");
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

export async function resendEmailVerificationCodeAction(): Promise<ResponseType> {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      type: "error",
      message: "Not authenticated",
    };
  }
  if (!sendVerificationEmailBucket.check(user.id, 1)) {
    return {
      type: "error",
      message: "Too many requests",
    };
  }
  let verificationRequest = await getUserEmailVerificationRequestFromRequest();
  if (verificationRequest === null) {
    if (user.emailVerified) {
      return {
        type: "error",
        message: "Forbidden",
      };
    }
    if (!sendVerificationEmailBucket.consume(user.id, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email
    );
  } else {
    if (!sendVerificationEmailBucket.consume(user.id, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      verificationRequest.email
    );
  }
  await sendVerificationEmail(
    verificationRequest.email,
    verificationRequest.code
  );
  await setEmailVerificationRequestCookie(verificationRequest);
  return {
    type: "success",
    message: "A new code was sent to your inbox.",
  };
}
