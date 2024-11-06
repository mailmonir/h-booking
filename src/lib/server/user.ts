import prisma from "../prisma";
// import { decrypt, encrypt } from "./encryption";
import { hashPassword } from "./password";

export function verifyUsernameInput(username: string): boolean {
  return (
    username.length > 3 && username.length < 32 && username.trim() === username
  );
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      providerId: "user",
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
    },
  });
  if (!user) {
    throw new Error("Unexpected error");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified || false,
  };
}

export async function updateUserPassword(
  userId: string,
  password: string
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function updateUserEmailAndSetEmailAsVerified(
  userId: string,
  email: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { email: email, emailVerified: true },
  });
}

export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: string,
  email: string
): Promise<boolean> {
  const result = await prisma.user.update({
    where: { id: userId, email: email },
    data: { emailVerified: true },
  });
  return result.emailVerified ?? false;
}

export async function getUserPasswordHash(userId: string): Promise<string> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (row === null) {
    throw new Error("Invalid user ID");
  }
  return row.passwordHash || "";
}

// export async function getUserRecoverCode(userId: string): Promise<string> {
//   const row = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { recoveryCode: true },
//   });
//   if (row === null) {
//     throw new Error("Invalid user ID");
//   }
//   if (row.recoveryCode === null) {
//     throw new Error("Recovery code is null");
//   }
//   return decryptToString(row.recoveryCode);
// }

// export async function getUserTOTPKey(
//   userId: string
// ): Promise<Uint8Array | null> {
//   const row = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { totpKey: true },
//   });

//   if (row === null) {
//     throw new Error("Invalid user ID");
//   }
//   const encrypted = row.totpKey;
//   if (encrypted === null) {
//     return null;
//   }
//   return decrypt(encrypted);
// }

// export async function updateUserTOTPKey(
//   userId: string,
//   key: Uint8Array
// ): Promise<void> {
//   const encrypted = encrypt(key);
//   await prisma.user.update({
//     where: { id: userId },
//     data: { totpKey: Buffer.from(encrypted) },
//   });
// }

// export function resetUserRecoveryCode(userId: string): string {
//   const recoveryCode = generateRandomRecoveryCode();
//   const encrypted = encryptString(recoveryCode);
//   prisma.user.updateMany({
//     where: { id: userId },
//     data: { recoveryCode: Buffer.from(encrypted) },
//   });

//   return recoveryCode;
// }

export async function getUserFromEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      avatarUrl: true,
    },
  });
  if (user === null) {
    return null;
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified || false,
    picture: user.avatarUrl[0],
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  picture?: string;
}
