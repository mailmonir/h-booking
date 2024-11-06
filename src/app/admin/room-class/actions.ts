"use server";

import prisma from "@/lib/prisma";
import { toSlug } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createRoomClassSchema } from "@/app/admin/room-class/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";

interface RoomClassActionProps {
  class_name: string;
  base_price: number;
  image: string[];
  description?: string;
  features?: string[];
  bedTypes?: { bedtype: string; numberOfBeds: string }[];
}

export async function createRoomClass(
  queryData: RoomClassActionProps
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createRoomClassSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const { class_name, base_price } = validation.data;

    const slug = `${toSlug(class_name)}`;

    const existingRoomClass = await prisma.room_Class.findUnique({
      where: {
        slug,
      },
    });

    if (existingRoomClass) {
      return { type: "error", message: "Room class already exists" };
    }

    const res = await prisma.room_Class.create({
      data: {
        class_name: class_name.trim(),
        slug,
        base_price: base_price,
        createdBy: user.email,
        image: queryData.image,
        description: queryData.description,
        features: {
          connect: queryData.features?.map((feature) => ({
            id: feature,
          })),
        },
        room_class_bed_type: {
          create: queryData.bedTypes?.map((bedType) => ({
            bed_type_id: bedType.bedtype,
            num_beds: Number(bedType.numberOfBeds),
            createdBy: user.email,
          })),
        },
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create room class" };
    }

    revalidatePath("/admin/room-class");
    redirect("/admin/room-class");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "There was a problem creating room class.",
    };
  }
}
export async function updateRoomClass(
  queryData: RoomClassActionProps,
  id: string
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  console.log(queryData);

  try {
    const validation = createRoomClassSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const existingRoomClass = await prisma.room_Class.findUnique({
      where: {
        id,
      },
    });

    if (!existingRoomClass) {
      return { type: "error", message: "Room class not found" };
    }

    const { class_name, base_price, features, bedTypes, description, image } =
      validation.data;

    const slug = `${toSlug(class_name)}`;

    const res = await prisma.room_Class.update({
      where: {
        id,
      },
      include: {
        room_class_bed_type: true,
        features: true,
      },
      data: {
        class_name: class_name.trim(),
        slug,
        base_price: base_price,
        updatedBy: user.email,
        image: image,
        description: description,
        features: {
          set: [],
          connect: features?.map((feature) => ({
            id: feature,
          })),
        },
        room_class_bed_type: {
          deleteMany: {},
          create: bedTypes?.map((bedType) => ({
            bed_type_id: bedType.bedtype,
            num_beds: Number(bedType.numberOfBeds),
            createdBy: user.email,
          })),
        },
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update room class" };
    }

    revalidatePath("/admin/room-class");
    redirect("/admin/room-class");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "There was a problem creating room class.",
    };
  }
}

export const deleteRoomClass = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedRoomCat = await prisma.room_Class.findUnique({
      where: {
        id,
      },
    });

    if (!tobeDeletedRoomCat) {
      return {
        success: false,
        message: `Room class ${id} not found`,
      };
    }

    await prisma.room_Class.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/room-class");
  } catch (error: unknown) {
    console.log(error);

    return { success: false, message: `Error deleting room class: ${id}` };
  }
};

export const getRoomClasses = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const roomClasses = await prisma.room_Class.findMany({
    orderBy: {
      class_name: "asc",
    },
  });
  return roomClasses;
};

export const getFilteredRoomClasses = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.room_Class.findMany({
    where: {
      AND: {
        class_name: {
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

export const getRoomClassCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const roomClassCount = await prisma.room_Class.count();
  return roomClassCount;
};

export const getRoomClass = async (slug: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const roomClass = await prisma.room_Class.findUnique({
    where: {
      slug,
    },
    include: {
      room_class_bed_type: true,
      features: true,
    },
  });
  return roomClass;
};
