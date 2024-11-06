"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createFloorSchema,
  CreateFloorSchemaType,
} from "@/app/admin/floors/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";

export async function createFloor(
  queryData: CreateFloorSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createFloorSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const { floor_number } = validation.data;

    // const slug = `${toSlug(status_name)}`;

    const existingFloor = await prisma.floor.findUnique({
      where: {
        floor_number: Number(floor_number),
      },
    });

    if (existingFloor) {
      return { type: "error", message: "Floor already exists" };
    }

    const res = await prisma.floor.create({
      data: {
        floor_number: Number(floor_number),
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create floor" };
    }

    revalidatePath("/admin/floors");
    redirect("/admin/floors");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong creating floor. Please try again later.",
    };
  }
}
export async function updateFloor(
  formData: CreateFloorSchemaType,
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
    const validation = createFloorSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const existingFloor = await prisma.floor.findUnique({
      where: {
        id,
      },
    });

    if (!existingFloor) {
      return { type: "error", message: "Floor not found" };
    }

    const { floor_number } = validation.data;

    const duplicateFloor = await prisma.floor.findUnique({
      where: {
        floor_number: Number(floor_number),
      },
    });

    if (duplicateFloor) {
      return { type: "error", message: "Floor number already exists" };
    }

    const res = await prisma.floor.update({
      where: {
        id,
      },
      data: {
        floor_number: Number(floor_number),
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update floor" };
    }

    revalidatePath("/admin/floors");
    redirect("/admin/floors");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong updating floor. Please try again later.",
    };
  }
}

export const deleteFloor = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedFloor = await prisma.floor.findUnique({
      where: {
        id,
      },
    });

    if (!tobeDeletedFloor) {
      return {
        success: false,
        message: `Floor type ${id} not found`,
      };
    }

    await prisma.floor.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/floors");
  } catch (error: unknown) {
    console.error(error);

    return { success: false, message: `Error deleting Floor type: ${id}` };
  }
};

export const getFloors = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const Floors = await prisma.floor.findMany({
    orderBy: {
      floor_number: "asc",
    },
  });
  return Floors;
};

export const getFilteredFloor = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const qry: { equals?: number; gt?: number } = {};

  if (query) {
    qry["equals"] = Number(query);
  } else {
    qry["gt"] = 0;
  }

  const response = await prisma.floor.findMany({
    where: {
      floor_number: qry,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * perPage,
    take: perPage,
  });
  return response;
};

export const getFloorCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const FloorsCount = await prisma.floor.count();
  return FloorsCount;
};

export const getFloor = async (id: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const Floor = await prisma.floor.findUnique({
    where: {
      id,
    },
  });
  return Floor;
};
