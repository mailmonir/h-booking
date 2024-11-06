"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
import { Media } from "@prisma/client";
import DraggableImageContainer from "./draggable-image-container";

interface FileWithPreview extends File {
  preview: string;
}

interface CustomDropzoneProps {
  onDropAccepted: (files: File[]) => void;
  maxFiles: number | 1;
  maxSize: number | 2097152; // 2MB
  acceptedTypes: string[];
  existingImages?: Media[];
  imageDeleteFn?: (url: string, id: string) => Promise<void>;
}

const CustomDropzone = ({
  onDropAccepted,
  maxFiles,
  maxSize,
  acceptedTypes,
  existingImages,
  imageDeleteFn,
}: CustomDropzoneProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [prvExistingImages, setPrvExistingImages] = useState<
    Media[] | undefined
  >(existingImages);

  const handleDeleteCatImage = async (url: string, id: string) => {
    setLoading(true);
    imageDeleteFn && (await imageDeleteFn(url, id));
    setPrvExistingImages(prvExistingImages?.filter((image) => image.id !== id));
    setLoading(false);
  };

  console.log(existingImages, previews);

  const accept = acceptedTypes.reduce(
    (acc: { [key: string]: [] }, mimeType) => {
      acc[mimeType] = [];
      return acc;
    },
    {}
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      onDropAccepted(acceptedFiles);
    },
    [files]
  );

  useEffect(() => {
    onDropAccepted(files);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: true, // Allow multiple files
  });

  // Generate previews for image files

  useEffect(() => {
    const newPreviews = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    ) as FileWithPreview[];

    setPreviews(newPreviews);

    // Revoke data URIs to avoid memory leaks
    return () => {
      newPreviews.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed border-border p-8 rounded-md bg-muted/30 cursor-pointer",
          isDragActive && "border-black/50 bg-muted"
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">
            Drop the files here...
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Drag & drop some files here, or click to select files (Max{" "}
            {maxFiles} file{maxFiles > 1 ? "s, each " : ""} up to{" "}
            {maxSize / 1024 / 1024} MB)
          </p>
        )}
      </div>
      <div>
        <ul className="flex flex-wrap gap-2 mt-4">
          {prvExistingImages &&
            prvExistingImages.length > 0 &&
            prvExistingImages.map((image) => (
              <li
                key={image.id}
                className="inline-block border border-border p-1 relative"
              >
                <Image
                  src={image.fileUrl}
                  alt={image?.altText || ""}
                  width={200}
                  height={200}
                  className="block w-24 h-24 object-cover"
                />
                {loading ? (
                  <Loader2
                    size={16}
                    className="absolute top-1 right-1 bg-gray-50/20 hover:bg-gray-50/60 cursor-pointer hover:text-destructive animate-spin"
                  />
                ) : (
                  <X
                    size={16}
                    onClick={() =>
                      handleDeleteCatImage(image.fileUrl, image.id)
                    }
                    className="absolute top-1 right-1 bg-gray-50/20 hover:bg-gray-50/60 cursor-pointer hover:text-destructive"
                  />
                )}
              </li>
            ))}
          {previews.length > 0 &&
            previews.map((file) => (
              <li
                key={file.name}
                className="relative inline-block border border-border p-1"
              >
                <Image
                  src={file.preview}
                  alt={file.name}
                  className="block w-24 h-24 object-cover"
                  width={200}
                  height={200}
                />
                <X
                  size={16}
                  onClick={() => setFiles(files.filter((f) => f !== file))}
                  className="absolute top-1 right-1 bg-gray-50/20 hover:bg-gray-50/60 cursor-pointer hover:text-destructive"
                />
              </li>
            ))}
          {existingImages && (
            <DraggableImageContainer savedImages={existingImages} />
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomDropzone;
