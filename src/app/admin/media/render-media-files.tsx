"use client";

import { useState } from "react";
import { Media } from "@prisma/client";
import Image from "next/image";
import FileDialog from "./file-dialog";

const RenderMediaFiles = ({ mediaFiles }: { mediaFiles: Media[] }) => {
  const [open, setOpen] = useState(false);
  const [cFile, setCFile] = useState<Media | null>(null);
  return (
    <div className="flex flex-wrap gap-4">
      {mediaFiles.map((file, index) => (
        <div
          className="focus:ring-2 ring-offset-4 cursor-pointer"
          tabIndex={index}
          key={index}
        >
          <Image
            src={file.fileUrl}
            alt={file.fileName}
            width={200}
            height={200}
            className="w-[163px] h-[163px] object-cover border border-border block"
            onClick={() => {
              setOpen(true);
              setCFile(file);
            }}
          />
        </div>
      ))}
      {cFile !== null && (
        <FileDialog open={open} setOpen={setOpen} cFile={cFile} />
      )}
    </div>
  );
};

export default RenderMediaFiles;
