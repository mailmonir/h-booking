"use client";
import axios from "axios";
import { cn } from "@/lib/utils";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

const MediaUploader: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    handleUpload(acceptedFiles);
  }, []);

  const handleUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();

        formData.append("file", file);

        // Update progress state
        setUploadProgress((prevProgress) => {
          const newProgress = [...prevProgress];
          newProgress[index] = 0;
          return newProgress;
        });

        // Send file to the server
        return axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prevProgress) => {
                const newProgress = [...prevProgress];
                newProgress[index] = percentCompleted;
                return newProgress;
              });
            }
          },
        });
      });

      await Promise.all(uploadPromises);
      setErrorMessage(null);
      console.log("All files uploaded successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrorMessage("Failed to upload files. Please try again.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="border border-border p-5 rounded-md max-w-7xl text-center my-0 mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "p-5 border-2 border-border border-dashed bg-background cursor-pointer transition duration-300 ease-in-out",
          isDragActive ? "bg-muted" : ""
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-muted-foreground text-sm">
            Drop the files here ...
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Drag & drop some files here, or click to select files
          </p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-5">
          {uploadedFiles.map((file, index) => (
            <div key={file.name} className="flex justify-between mb-3">
              <p>{file.name}</p>
              <p>Progress: {uploadProgress[index] || 0}%</p>
            </div>
          ))}
        </div>
      )}

      {errorMessage && <p className="text-destructive">{errorMessage}</p>}
    </div>
  );
};

export default MediaUploader;
