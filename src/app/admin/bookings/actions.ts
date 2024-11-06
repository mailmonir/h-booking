"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBookingSchema,
  CreateBookingSchemaType,
} from "@/app/admin/bookings/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";

export async function createBooking(
  queryData: CreateBookingSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createBookingSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const {
      floor_id,
      Booking_class_id,
      Booking_status_id,
      Booking_number,
      Booking_images,
    } = validation.data;

    const existingBooking = await prisma.booking.findUnique({
      where: {
        booking_number: Booking_number,
      },
    });

    if (existingBooking) {
      return { type: "error", message: "Booking already exists" };
    }

    const res = await prisma.booking.create({
      data: {
        Booking_number: Booking_number,
        floor_id,
        Booking_class_id,
        Booking_status_id,
        Booking_images,
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create Booking" };
    }

    revalidatePath("/admin/Bookings");
    redirect("/admin/Bookings");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong creating Booking. Please try again later.",
    };
  }
}
export async function updateBooking(
  formData: CreateBookingSchemaType,
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
    const validation = createBookingSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const {
      floor_id,
      Booking_class_id,
      Booking_status_id,
      Booking_number,
      Booking_images,
    } = validation.data;

    const existingBooking = await prisma.booking.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingBooking) {
      return { type: "error", message: "Booking not found" };
    }

    const res = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        Booking_number: Booking_number,
        floor_id,
        Booking_class_id,
        Booking_status_id,
        Booking_images,
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update Booking" };
    }

    revalidatePath("/admin/Bookings");
    redirect("/admin/Bookings");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message: "Something went wrong updating Booking. Please try again later.",
    };
  }
}

export const deleteBooking = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const tobeDeletedBooking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!tobeDeletedBooking) {
      return {
        success: false,
        message: `Booking type ${id} not found`,
      };
    }

    await prisma.booking.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/Bookings");
  } catch (error: unknown) {
    console.error(error);

    return { success: false, message: `Error deleting Booking type: ${id}` };
  }
};

export const getBookings = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const Bookings = await prisma.booking.findMany({
    orderBy: {
      Booking_number: "asc",
    },
  });
  return Bookings;
};

export const getFilteredBooking = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.booking.findMany({
    where: {
      OR: [
        {
          Booking_number: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          Booking_class: {
            class_name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          Booking_status: {
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
      Booking_class: true,
      Booking_status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * perPage,
    take: perPage,
  });
  return response;
};

export const getBookingCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const BookingsCount = await prisma.booking.count();
  return BookingsCount;
};

export const getBooking = async (id: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const Booking = await prisma.booking.findUnique({
    where: {
      id,
    },
  });
  return Booking;
};
