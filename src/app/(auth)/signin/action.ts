"use server";
import prisma from "@/lib/prisma";
import { signinSchema, SigninSchemaType } from "@/app/(auth)/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { ResponseType } from "@/lib/types";
import { verifyPasswordHash } from "@/lib/server/password";
import { RefillingTokenBucket, Throttler } from "@/lib/server/rate-limit";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { getUserPasswordHash } from "@/lib/server/user";
import { headers } from "next/headers";
import { globalPOSTRateLimit } from "@/lib/server/request";

const throttler = new Throttler<string>([
  "1",
  "2",
  "4",
  "8",
  "16",
  "30",
  "60",
  "180",
  "300",
]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);

export async function signIn(
  credential: SigninSchemaType
): Promise<ResponseType> {
  try {
    if (!globalPOSTRateLimit()) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }
    // TODO: Assumes X-Forwarded-For is always included.
    const headersObj = await headers();
    const clientIP = headersObj.get("X-Forwarded-For");

    if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    const validatedSigninData = signinSchema.safeParse(credential);

    if (!validatedSigninData.success) {
      return {
        type: "error",
        message: validatedSigninData.error.message,
      };
    }

    const { email, password } = validatedSigninData.data;

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return { type: "error", message: "Incorrect username or password" };
    }

    if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    if (!throttler.consume(existingUser.id)) {
      return {
        type: "error",
        message: "Too many requests",
      };
    }

    const passwordHash = await getUserPasswordHash(existingUser.id);
    const validPassword = await verifyPasswordHash(passwordHash, password);
    if (!validPassword) {
      return {
        type: "error",
        message: "Invalid password",
      };
    }
    throttler.reset(existingUser.id);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(sessionToken, session.expiresAt);

    if (!existingUser.emailVerified) {
      return redirect("/verify-email");
    }

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
