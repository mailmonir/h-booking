"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createPaymentStatusSchema,
  CreatePaymentStatusSchemaType,
} from "@/app/admin/payment-status/schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResponseType } from "@/lib/types";
import { toSlug } from "@/lib/utils";

export async function createPaymentStatus(
  queryData: CreatePaymentStatusSchemaType
): Promise<ActionResponseType> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      type: "error",
      message: "You are not authorized to access this page",
    };
  }

  try {
    const validation = createPaymentStatusSchema.safeParse(queryData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const { payment_status_name } = validation.data;

    const slug = `${toSlug(payment_status_name)}`;

    const existingPaymentStatus = await prisma.payment_Status.findUnique({
      where: {
        slug,
      },
    });

    if (existingPaymentStatus) {
      return { type: "error", message: "payment status already exists" };
    }

    const res = await prisma.payment_Status.create({
      data: {
        payment_status_name: payment_status_name.trim(),
        slug,
        createdBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to create payment status" };
    }

    revalidatePath("/admin/payment-status");
    redirect("/admin/payment-status");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message:
        "Something went wrong creating payment_Status. Please try again later.",
    };
  }
}
export async function updatePaymentStatus(
  formData: CreatePaymentStatusSchemaType,
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
    const validation = createPaymentStatusSchema.safeParse(formData);

    if (!validation.success) {
      return { type: "error", message: validation.error.issues };
    }

    const existingPaymentStatus = await prisma.payment_Status.findUnique({
      where: {
        id,
      },
    });

    if (!existingPaymentStatus) {
      return { type: "error", message: "Payment status not found" };
    }

    const { payment_status_name } = validation.data;

    const slug = `${toSlug(payment_status_name)}`;

    const res = await prisma.payment_Status.update({
      where: {
        id,
      },
      data: {
        payment_status_name: payment_status_name.trim(),
        slug,
        updatedBy: user.email,
      },
    });

    if (!res) {
      return { type: "error", message: "Failed to update payment status" };
    }

    revalidatePath("/admin/payment-status");
    redirect("/admin/payment-status");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      type: "error",
      message:
        "Something went wrong updating payment status. Please try again later.",
    };
  }
}

export const deletePaymentStatus = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      success: false,
      message: "You are not authorized to access this page",
    };
  }

  try {
    const toDeletePaymentStatus = await prisma.payment_Status.findUnique({
      where: {
        id,
      },
    });

    if (!toDeletePaymentStatus) {
      return {
        success: false,
        message: `payment_Status type ${id} not found`,
      };
    }

    await prisma.payment_Status.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/payment-status");
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: `Error deleting payment status type: ${id}`,
    };
  }
};

export const getPaymentStatuses = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }
  const paymentStatus = await prisma.payment_Status.findMany({
    orderBy: {
      payment_status_name: "asc",
    },
  });
  return paymentStatus;
};

export const getFilteredPaymentStatus = async (
  query: string,
  currentPage: number,
  perPage: number
) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  const response = await prisma.payment_Status.findMany({
    where: {
      AND: {
        payment_status_name: {
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

export const getPaymentStatusCount = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    return 0;
  }

  const paymentStatusCount = await prisma.payment_Status.count();
  return paymentStatusCount;
};

export const getPaymentStatus = async (slug: string) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  const payment_Status = await prisma.payment_Status.findUnique({
    where: {
      slug,
    },
  });
  return payment_Status;
};
