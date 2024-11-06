"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import {
  signupSchema,
  SignupSchemaType,
  updateUserSchema,
  UpdateUserSchemaType,
} from "@/app/admin/users/schema";
import { hash } from "@node-rs/argon2";

import { ActionResponseType } from "@/lib/types";

export async function createUser(
  credential: SignupSchemaType
): Promise<ActionResponseType> {
  try {
    const values = signupSchema.safeParse(credential);

    if (!values.success) {
      return { type: "error", message: values.error.issues };
    }

    const { name, email, password, role, bio, image } =
      signupSchema.parse(credential);

    if (!["guest", "stuff", "manager", "admin"].includes(role)) {
      return { type: "error", message: "Invalid role" };
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // const userId = generateIdFromEntropySize(10);

    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (existingEmail) {
      return { type: "error", message: "Email already exists" };
    }

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        passwordHash: passwordHash,
        emailVerified: false,
        role: role as "guest" | "stuff" | "manager" | "admin",
        bio: bio,
        avatarUrl: image ? image : [],
        providerId: "user",
      },
    });

    const response = await sendVerificationCode(email, userId);

    if (!response) {
      await prisma.user.delete({ where: { id: userId } });
      return {
        type: "error",
        message: "Failed to signup. Please try again later",
      };
    } else {
      redirect("/admin/users");
    }
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Failed to signup. Please try again later",
    };
  }
}
export async function updateUser(
  credential: UpdateUserSchemaType
): Promise<ActionResponseType> {
  try {
    const values = updateUserSchema.safeParse(credential);

    if (!values.success) {
      return { type: "error", message: values.error.issues };
    }

    const { name, email, password, role, bio, image } =
      updateUserSchema.parse(credential);

    if (!["buyer", "seller", "manager", "admin", "sadmin"].includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    const passwordHash =
      password && password !== null
        ? await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
          })
        : undefined;

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    console.log(existingUser);

    if (existingUser) {
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          name: name,
          email: email,
          passwordHash: passwordHash,
          emailVerified: false,
          role: role as "guest" | "stuff" | "manager" | "admin",
          bio: bio,
          avatarUrl: image ? image : [],
          providerId: "user",
        },
      });
    }

    redirect("/admin/users");
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Failed to signup. Please try again later",
    };
  }
}

export const deleteUser = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!tobeDeletedUser) {
      return {
        success: false,
        message: `User ${id} not found`,
      };
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/users");
  } catch (error: unknown) {
    console.error(error);

    return { success: false, message: `Error deleting user: ${id}` };
  }
};

export const getUsers = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return users;
};

export const getFilteredUsers = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.user.findMany({
    where: {
      AND: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * perPage,
    take: perPage,
  });
  return response;
};

export const getUsersCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const usersCount = await prisma.user.count();
  return usersCount;
};

export const getUser = async (id: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const usr = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!usr) {
    return null;
  }

  usr.passwordHash = "";
  return usr;
};

export const getGuests = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const usr = await prisma.user.findMany({
    where: {
      role: "guest",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return usr;
};
