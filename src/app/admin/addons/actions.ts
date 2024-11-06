"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createAddonsSchema,
  CreateAddonsSchemaType,
} from "@/app/admin/addons/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";
import { toSlug } from "@/lib/utils";

export async function createAddon(
  queryData: CreateAddonsSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createAddonsSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const { addon_name, price } = validation.data;

    const slug = `${toSlug(addon_name)}`;

    const existingAddon = await prisma.addon.findUnique({
      where: {
        slug,
      },
    });

    if (existingAddon) {
      return { type: "error", message: "Addon already exists" };
    }

    const res = await prisma.addon.create({
      data: {
        addon_name: addon_name.trim(),
        price,
        slug,
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create addon" };
    }

    revalidatePath("/admin/addons");
    redirect("/admin/addons");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong creating addon. Please try again later.",
    };
  }
}
export async function updateAddon(
  formData: CreateAddonsSchemaType,
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
    const validation = createAddonsSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const existingAddon = await prisma.addon.findUnique({
      where: {
        id,
      },
    });

    if (!existingAddon) {
      return { type: "error", message: "Addon not found" };
    }

    const { addon_name, price } = validation.data;

    const slug = `${toSlug(addon_name)}`;

    const res = await prisma.addon.update({
      where: {
        id,
      },
      data: {
        addon_name: addon_name.trim(),
        price,
        slug,
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update Addon" };
    }

    revalidatePath("/admin/addons");
    redirect("/admin/addons");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong updating Addon. Please try again later.",
    };
  }
}

export const deleteAddon = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const toAddoneletedAddon = await prisma.addon.findUnique({
      where: {
        id,
      },
    });

    if (!toAddoneletedAddon) {
      return {
        success: false,
        message: `Addon type ${id} not found`,
      };
    }

    await prisma.addon.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/addons");
  } catch (error: unknown) {
    console.error(error);

    return { success: false, message: `Error deleting addon type: ${id}` };
  }
};

export const getAddons = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const Addons = await prisma.addon.findMany({
    orderBy: {
      addon_name: "asc",
    },
  });
  return Addons;
};

export const getFilteredAddon = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.addon.findMany({
    where: {
      AND: {
        addon_name: {
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

export const getAddonCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const AddonsCount = await prisma.addon.count();
  return AddonsCount;
};

export const getAddon = async (slug: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const Addon = await prisma.addon.findUnique({
    where: {
      slug,
    },
  });
  return Addon;
};
