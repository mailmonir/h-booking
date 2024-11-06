import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMediaFiles } from "@/app/admin/media/media-action";
import { useEffect, useState } from "react";
import { Media } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const MediaInserter = ({
  open,
  setOpen,
  setSelectedImages,
  multiple,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  multiple: boolean;
}) => {
  const [mediaFiles, setMediaFiles] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    async function getMedia() {
      try {
        setLoading(true);
        const response = await getMediaFiles();
        setMediaFiles(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getMedia();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setImages([]);
        setOpen(false);
      }}
    >
      <DialogContent className="max-w-[calc(100vw-100px)] h-[calc(100vh-100px)] content-start ">
        <DialogHeader>
          <DialogTitle>Select images?</DialogTitle>
          <DialogDescription>Select one or more images</DialogDescription>
          <div className="flex flex-col justify-between h-[calc(100vh-200px)]">
            <ScrollArea className="border border-border p-4 !mt-6 h-full w-full">
              <div className="flex flex-wrap gap-4">
                {mediaFiles?.length > 0 ? (
                  mediaFiles.map((file) => (
                    <Image
                      key={file.id}
                      src={file.fileUrl}
                      alt={file.altText || file.fileName || "Media file"}
                      width={200}
                      height={200}
                      className={cn(
                        "w-[159px] h-[159px] inline-block",
                        images.includes(file.fileUrl)
                          ? "ring-2 ring-primary ring-offset-4"
                          : ""
                      )}
                      onClick={() => {
                        if (multiple) {
                          setImages((prev) =>
                            prev.includes(file.fileUrl)
                              ? prev.filter((i) => i !== file.fileUrl)
                              : [...prev, file.fileUrl]
                          );
                        } else {
                          setImages([file.fileUrl]);
                        }
                      }}
                      onDoubleClick={() => {
                        if (multiple) {
                          setSelectedImages((prev) => [...prev, file.fileUrl]);
                        } else {
                          setSelectedImages([file.fileUrl]);
                        }
                        setImages([]);
                        setOpen(false);
                      }}
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No media files found
                  </p>
                )}
              </div>
            </ScrollArea>

            <div className="space-x-2 ml-auto mt-6">
              <Button
                variant="outline"
                className="min-w-24"
                onClick={() => {
                  setImages([]);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setSelectedImages((prev) => [...prev, ...images]);
                  setImages([]);
                  setOpen(false);
                }}
                className="min-w-24"
              >
                Insert
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MediaInserter;
