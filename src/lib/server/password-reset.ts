import { encodeHexLowerCase } from "@oslojs/encoding";
import { generateRandomOTP } from "./utils";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";

import type { User } from "./user";
import prisma from "../prisma";
import nodemailer from "nodemailer";

export async function createPasswordResetSession(
  token: string,
  userId: string,
  email: string
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    code: generateRandomOTP(),
    emailVerified: false,
  };
  await prisma.passwordResetSession.create({
    data: {
      id: session.id,
      userId: session.userId,
      email: session.email,
      code: session.code,
      expiresAt: session.expiresAt,
      emailVerified: false,
    },
  });
  return session;
}

export async function validatePasswordResetSessionToken(
  token: string
): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const row = await prisma.passwordResetSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      userId: true,
      email: true,
      code: true,
      expiresAt: true,
      emailVerified: true,
      user: {
        select: {
          id: true,
          email: true,
          emailVerified: true,
        },
      },
    },
  });
  if (row === null) {
    return { session: null, user: null };
  }
  const session: PasswordResetSession = {
    id: row.id,
    userId: row.userId,
    email: row.email,
    code: row.code,
    expiresAt: row.expiresAt,
    emailVerified: row.emailVerified,
  };
  const user: User = {
    id: row.user.id,
    name: row.user.email,
    email: row.user.email,
    emailVerified: row.user.emailVerified || false,
  };
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.passwordResetSession.delete({ where: { id: session.id } });
    return { session: null, user: null };
  }
  return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(
  sessionId: string
): Promise<void> {
  await prisma.passwordResetSession.update({
    where: { id: sessionId },
    data: { emailVerified: true },
  });
}

// export async function setPasswordResetSessionAs2FAVerified(
//   sessionId: string
// ): Promise<void> {
//   await prisma.passwordResetSession.update({
//     where: { id: sessionId },
//     data: { twoFactorVerified: true },
//   });
// }

export async function invalidateUserPasswordResetSessions(
  userId: string
): Promise<void> {
  await prisma.passwordResetSession.deleteMany({ where: { userId } });
}

export async function validatePasswordResetSessionRequest(): Promise<PasswordResetSessionValidationResult> {
  const cookiePromise = await cookies();
  const token = cookiePromise.get("password_reset_session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validatePasswordResetSessionToken(token);
  if (result.session === null) {
    deletePasswordResetSessionTokenCookie();
  }
  return result;
}

export async function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookiePromise = await cookies();
  cookiePromise.set("password_reset_session", token, {
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function deletePasswordResetSessionTokenCookie(): Promise<void> {
  const cookiePromise = await cookies();
  cookiePromise.set("password_reset_session", "", {
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function sendPasswordResetEmail(
  email: string,
  code: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Password reset link",
    text: "Your password reset link is: " + code,
  };

  await transporter.sendMail(mailOptions);
}

export interface PasswordResetSession {
  id: string;
  userId: string;
  email: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };
