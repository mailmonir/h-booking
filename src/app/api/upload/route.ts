import path from "path";
import fs from "fs";
import { unlink } from "fs";
import { nanoid } from "nanoid";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { revalidatePath } from "next/cache";
// import { FileWithDimensions } from "@/lib/types";
import sharp from "sharp";

export async function POST(request: Request) {
  const { user } = await getCurrentSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await request.formData();
  const file = data.get("file") as Blob;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${nanoid()}-${(file as File).name}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await writeFile(filePath, buffer);

    const { width, height } = await sharp(filePath).metadata();

    const mediaRecord = await prisma.media.create({
      data: {
        fileUrl: `/uploads/${fileName}`,
        fileName: fileName,
        fileType: (file as File).type,
        uploadedBy: user?.email || "admin",
        size: (file as File).size,
        width: width,
        height: height,
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
    return NextResponse.json(mediaRecord);
  } catch (error) {
    console.error("File upload error:", error);
    unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
