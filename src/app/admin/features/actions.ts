"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createFeatureSchema,
  CreateFeatureSchemaType,
} from "@/app/admin/features/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";
import { toSlug } from "@/lib/utils";

export async function createFeature(
  queryData: CreateFeatureSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createFeatureSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const { feature_name } = validation.data;

    const slug = `${toSlug(feature_name)}`;

    const existingfeature = await prisma.feature.findUnique({
      where: {
        slug,
      },
    });

    if (existingfeature) {
      return { type: "error", message: "feature already exists" };
    }

    const res = await prisma.feature.create({
      data: {
        feature_name: feature_name.trim(),
        slug,
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create feature" };
    }

    revalidatePath("/admin/features");
    redirect("/admin/features");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong creating feature. Please try again later.",
    };
  }
}
export async function updateFeature(
  formData: CreateFeatureSchemaType,
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
    const validation = createFeatureSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const existingfeature = await prisma.feature.findUnique({
      where: {
        id,
      },
    });

    if (!existingfeature) {
      return { type: "error", message: "feature not found" };
    }

    const { feature_name } = validation.data;

    const slug = `${toSlug(feature_name)}`;

    const res = await prisma.feature.update({
      where: {
        id,
      },
      data: {
        feature_name: feature_name.trim(),
        slug,
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update feature" };
    }

    revalidatePath("/admin/features");
    redirect("/admin/features");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong updating feature. Please try again later.",
    };
  }
}

export const deleteFeature = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedFeature = await prisma.feature.findUnique({
      where: {
        id,
      },
    });

    if (!tobeDeletedFeature) {
      return {
        success: false,
        message: `Feature ${id} not found`,
      };
    }

    await prisma.feature.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/categories");
  } catch (error: unknown) {
    console.error(error);

    return { success: false, message: `Error deleting feature: ${id}` };
  }
};

export const getFeatures = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const features = await prisma.feature.findMany({
    orderBy: {
      feature_name: "asc",
    },
  });
  return features;
};

export const getFilteredFeatures = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.feature.findMany({
    where: {
      AND: {
        feature_name: {
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

export const getFeaturesCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const featuresCount = await prisma.feature.count();
  return featuresCount;
};

export const getFeature = async (slug: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const feature = await prisma.feature.findUnique({
    where: {
      slug,
    },
  });
  return feature;
};

// export async function getFeatureForUpdate(featureId: string) {
//   const { user } = await getCurrentSession();
//   if (!user) {
//     return null;
//   }

//   // Fetch all categories except the current one and its parent
//   const availableFeatuForParent = await prisma.feature.findMany({
//     where: {
//       id: { not: featureId },
//       OR: [{ parentId: { not: featureId } }, { parentId: null }],
//     },
//     include: { parent: true, children: true },
//   });
//   return availableCategoriesForParent;
// }
