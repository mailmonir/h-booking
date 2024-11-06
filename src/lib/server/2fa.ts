import prisma from "../prisma";
import { decryptToString, encryptString } from "./encryption";
import { ExpiringTokenBucket } from "./rate-limit";
import { generateRandomRecoveryCode } from "./utils";

export const totpBucket = new ExpiringTokenBucket<string>(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket<string>(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(
  userId: string,
  recoveryCode: string
): Promise<boolean> {
  // Note: In Postgres and MySQL, these queries should be done in a transaction using SELECT FOR UPDATE
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { recoveryCode: true },
  });
  if (row === null) {
    return false;
  }
  const encryptedRecoveryCode = row.recoveryCode;
  const userRecoveryCode = decryptToString(encryptedRecoveryCode);
  if (recoveryCode !== userRecoveryCode) {
    return false;
  }

  const newRecoveryCode = generateRandomRecoveryCode();
  const encryptedNewRecoveryCode = encryptString(newRecoveryCode);

  await prisma.user.update({
    where: { id: userId },
    data: {
      recoveryCode: Buffer.from(encryptedNewRecoveryCode),
    },
  });
  // Compare old recovery code to ensure recovery code wasn't updated.
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      recoveryCode: Buffer.from(encryptedNewRecoveryCode),
      totpKey: null,
    },
  });
  return result !== null && result !== undefined;
}
