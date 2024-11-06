"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createRoomStatusSchema,
  CreateRoomStatusSchemaType,
} from "@/app/admin/room-status/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";
import { toSlug } from "@/lib/utils";

export async function createRoomStatus(
  queryData: CreateRoomStatusSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createRoomStatusSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const { status_name } = validation.data;

    const slug = `${toSlug(status_name)}`;

    const existingBed = await prisma.room_Status.findUnique({
      where: {
        slug,
      },
    });

    if (existingBed) {
      return { type: "error", message: "Bed already exists" };
    }

    const res = await prisma.room_Status.create({
      data: {
        status_name: status_name.trim(),
        slug,
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create Bed" };
    }

    revalidatePath("/admin/room-status");
    redirect("/admin/room-status");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong creating Bed. Please try again later.",
    };
  }
}
export async function updateRoomStatus(
  formData: CreateRoomStatusSchemaType,
  id: string
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createRoomStatusSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const existingBed = await prisma.room_Status.findUnique({
      where: {
        id,
      },
    });

    if (!existingBed) {
      return { type: "error", message: "Bed not found" };
    }

    const { status_name } = validation.data;

    const slug = `${toSlug(status_name)}`;

    const res = await prisma.room_Status.update({
      where: {
        id,
      },
      data: {
        status_name: status_name.trim(),
        slug,
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update Bed" };
    }

    revalidatePath("/admin/room-status");
    redirect("/admin/room-status");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong updating Bed. Please try again later.",
    };
  }
}

export const deleteRoomStatus = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedBed = await prisma.room_Status.findUnique({
      where: {
        id,
      },
    });

    if (!tobeDeletedBed) {
      return {
        success: false,
        message: `Bed type ${id} not found`,
      };
    }

    await prisma.room_Status.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/categories");
  } catch (error: unknown) {
    console.error(error);

    return { success: false, message: `Error deleting bed type: ${id}` };
  }
};

export const getRoomStatuses = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const Beds = await prisma.room_Status.findMany({
    orderBy: {
      status_name: "asc",
    },
  });
  return Beds;
};

export const getFilteredRoomStatus = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.room_Status.findMany({
    where: {
      AND: {
        status_name: {
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

export const getRoomStatusCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const BedsCount = await prisma.room_Status.count();
  return BedsCount;
};

export const getRoomStatus = async (slug: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const Bed = await prisma.room_Status.findUnique({
    where: {
      slug,
    },
  });
  return Bed;
};
