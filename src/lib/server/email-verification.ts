import { generateRandomOTP } from "./utils";
import prisma from "../prisma";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32 } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";
import { EmailVerificationRequest } from "@prisma/client";
import nodemailer from "nodemailer";

export async function getUserEmailVerificationRequest(
  userId: string,
  id: string
): Promise<EmailVerificationRequest | null> {
  const request = await prisma.emailVerificationRequest.findFirst({
    where: {
      id,
      userId,
    },
  });
  return request;
}

export async function createEmailVerificationRequest(
  userId: string,
  email: string
): Promise<EmailVerificationRequest> {
  deleteUserEmailVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  const request = await prisma.emailVerificationRequest.create({
    data: {
      id,
      userId,
      code,
      email,
      expiresAt: new Date(expiresAt.getTime()),
    },
  });

  return request;
}

export async function deleteUserEmailVerificationRequest(
  userId: string
): Promise<void> {
  await prisma.emailVerificationRequest.deleteMany({
    where: {
      userId,
    },
  });
}

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
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
    subject: "Email verification code",
    text: "Your verification code is: " + code,
  };

  const response = await transporter.sendMail(mailOptions);

  if (response.accepted.length !== 0) {
    return true;
  } else {
    return false;
  }
}

export async function setEmailVerificationRequestCookie(
  request: EmailVerificationRequest
): Promise<void> {
  const cookiePromise = await cookies();
  cookiePromise.set("email_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expiresAt,
  });
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
  const cookiePromise = await cookies();
  cookiePromise.set("email_verification", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function getUserEmailVerificationRequestFromRequest(): Promise<EmailVerificationRequest | null> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }
  const cookiePromise = await cookies();
  const id = cookiePromise.get("email_verification")?.value ?? null;
  console.log(id);
  if (id === null) {
    return null;
  }
  const request = await getUserEmailVerificationRequest(user.id, id);
  if (request === null) {
    await deleteEmailVerificationRequestCookie();
  }
  return request;
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<string>(
  3,
  60 * 10
);

// export interface EmailVerificationRequest {
//   id: string;
//   userId: number;
//   code: string;
//   email: string;
//   expiresAt: Date;
// }
