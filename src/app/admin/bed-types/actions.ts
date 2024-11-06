"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBedTypeSchema,
  CreateBedTypeSchemaType,
} from "@/app/admin/bed-types/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";
import { toSlug } from "@/lib/utils";

export async function createBedType(
  queryData: CreateBedTypeSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createBedTypeSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const { bed_type_name } = validation.data;

    const slug = `${toSlug(bed_type_name)}`;

    const existingBed = await prisma.bed_Type.findUnique({
      where: {
        slug,
      },
    });

    if (existingBed) {
      return { type: "error", message: "Bed already exists" };
    }

    const res = await prisma.bed_Type.create({
      data: {
        bed_type_name: bed_type_name.trim(),
        slug,
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create Bed" };
    }

    revalidatePath("/admin/bed-types");
    redirect("/admin/bed-types");
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
export async function updateBedType(
  formData: CreateBedTypeSchemaType,
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
    const validation = createBedTypeSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const existingBed = await prisma.bed_Type.findUnique({
      where: {
        id,
      },
    });

    if (!existingBed) {
      return { type: "error", message: "Bed not found" };
    }

    const { bed_type_name } = validation.data;

    const slug = `${toSlug(bed_type_name)}`;

    const res = await prisma.bed_Type.update({
      where: {
        id,
      },
      data: {
        bed_type_name: bed_type_name.trim(),
        slug,
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update Bed" };
    }

    revalidatePath("/admin/bed-types");
    redirect("/admin/bed-types");
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

export const deleteBedType = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedBed = await prisma.bed_Type.findUnique({
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

    await prisma.bed_Type.delete({
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

export const getBedTypes = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const Beds = await prisma.bed_Type.findMany({
    orderBy: {
      bed_type_name: "asc",
    },
  });
  return Beds;
};

export const getFilteredBedTypes = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.bed_Type.findMany({
    where: {
      AND: {
        bed_type_name: {
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

export const getBedTypesCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const BedsCount = await prisma.bed_Type.count();
  return BedsCount;
};

export const getBedType = async (slug: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const Bed = await prisma.bed_Type.findUnique({
    where: {
      slug,
    },
  });
  return Bed;
};
