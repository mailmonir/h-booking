"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createRoomSchema,
  CreateRoomSchemaType,
} from "@/app/admin/rooms/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";

export async function createRoom(
  queryData: CreateRoomSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createRoomSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const {
      floor_id,
      room_class_id,
      room_status_id,
      room_number,
      room_images,
    } = validation.data;

    const existingRoom = await prisma.room.findUnique({
      where: {
        room_number: room_number,
      },
    });

    if (existingRoom) {
      return { type: "error", message: "Room already exists" };
    }

    const res = await prisma.room.create({
      data: {
        room_number: room_number,
        floor_id,
        room_class_id,
        room_status_id,
        room_images,
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create Room" };
    }

    revalidatePath("/admin/rooms");
    redirect("/admin/rooms");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong creating room. Please try again later.",
    };
  }
}
export async function updateRoom(
  formData: CreateRoomSchemaType,
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
    const validation = createRoomSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const {
      floor_id,
      room_class_id,
      room_status_id,
      room_number,
      room_images,
    } = validation.data;

    const existingRoom = await prisma.room.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingRoom) {
      return { type: "error", message: "Room not found" };
    }

    const res = await prisma.room.update({
      where: {
        id,
      },
      data: {
        room_number: room_number,
        floor_id,
        room_class_id,
        room_status_id,
        room_images,
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update room" };
    }

    revalidatePath("/admin/rooms");
    redirect("/admin/rooms");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong updating room. Please try again later.",
    };
  }
}

export const deleteRoom = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedRoom = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!tobeDeletedRoom) {
      return {
        success: false,
        message: `Room type ${id} not found`,
      };
    }

    await prisma.room.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/rooms");
  } catch (error: unknown) {
    console.error(error);

    return { success: false, message: `Error deleting Room type: ${id}` };
  }
};

export const getRooms = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const Rooms = await prisma.room.findMany({
    orderBy: {
      room_number: "asc",
    },
    include: {
      floor: true,
      room_class: true,
      room_status: true,
    },
  });
  return Rooms;
};

export const getFilteredRoom = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.room.findMany({
    where: {
      OR: [
        {
          room_number: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          room_class: {
            class_name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          room_status: {
            status_name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: {
      floor: true,
      room_class: true,
      room_status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * perPage,
    take: perPage,
  });
  return response;
};

export const getRoomCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const RoomsCount = await prisma.room.count();
  return RoomsCount;
};

export const getRoom = async (id: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const Room = await prisma.room.findUnique({
    where: {
      id,
    },
  });
  return Room;
};
