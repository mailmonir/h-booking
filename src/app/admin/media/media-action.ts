"use server";

import path from "path";
import { unlink } from "fs";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/server/session";
import { writeFile } from "fs/promises";
import fs from "fs";

export const getMediaFiles = async () => {
  const files = await prisma.media.findMany();
  return files;
};

export const getMediaCount = async () => {
  const mediaCount = await prisma.media.count();
  return mediaCount;
};

export const getFilteredMedia = async (
  query: string | undefined,
  currentPage: number,
  perPage: number
) => {
  const response = await prisma.media.findMany({
    where: {
      OR: [
        {
          fileName: {
            contains: query,
            mode: "insensitive",
          },
        },
        { altText: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * perPage,
    take: perPage,
  });
  return response;
};

export const createMedia = async (fileData: FormData) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const file = fileData.get("file") as Blob | null;

  if (!file) {
    return { error: "No file uploaded" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${nanoid()}-${(file as File).name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    await writeFile(filePath, buffer);

    const mediaRecord = await prisma.media.create({
      data: {
        fileUrl: `/uploads/${fileName}`,
        fileName: fileName,
        fileType: (file as File).type,
        uploadedBy: user?.email || user?.email,
        createdBy: user?.email,
      },
    });

    if (!mediaRecord) {
      unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    revalidatePath("/admin/media");
    return { fileUrl: mediaRecord.fileUrl };
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
};

export const updateMedia = async (
  fieldName: string,
  fieldValue: string,
  id: string
) => {
  try {
    const mediaRecord = await prisma.media.update({
      where: {
        id,
      },
      data: {
        [fieldName]: fieldValue,
      },
    });

    if (!mediaRecord) {
      return { error: "Failed to update media" };
    }

    return mediaRecord;
  } catch (error) {
    console.log(error);
    return { error: "Failed to update media" };
  }
};

export const deleteMedia = async (id: string) => {
  try {
    // Step 1: Retrieve the record to get the file path
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return { error: "Post not found" };
    }

    // Step 2: Delete the record from the database
    await prisma.media.delete({
      where: { id },
    });

    // Step 3: Remove the file from the public folder
    const filePath = path.join(process.cwd(), "public", media.fileUrl);

    // Check if file exists before deleting
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Deletes the file
      console.log(`File ${media.fileUrl} deleted successfully.`);
    } else {
      console.warn(`File ${media.fileUrl} does not exist.`);
    }

    return { message: "Post and associated file deleted successfully" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while deleting the post and file." };
  }
};

export const nextRecord = async (id: string) => {
  const currentRecord = await prisma.media.findFirst({
    where: {
      id,
    },
  });

  const nextRecordByDate = await prisma.media.findFirst({
    where: {
      createdAt: {
        lt: currentRecord?.createdAt,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return nextRecordByDate;
};
export const prevRecord = async (id: string) => {
  const currentRecord = await prisma.media.findFirst({
    where: {
      id,
    },
  });

  const prevRecordByDate = await prisma.media.findFirst({
    where: {
      createdAt: {
        gt: currentRecord?.createdAt,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return prevRecordByDate;
};
