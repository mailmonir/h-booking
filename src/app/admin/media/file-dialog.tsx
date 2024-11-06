import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Media } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatBytes } from "@/lib/utils";
import MediaUpdateForm from "./media-update-form";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  nextRecord,
  prevRecord,
  deleteMedia,
} from "@/app/admin/media/media-action";
// import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

const FileDialog = ({
  open,
  setOpen,
  cFile,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cFile: Media;
}) => {
  const [currentFile, setCurrentFile] = useState<Media | null>(cFile);
  const [loading, setLoading] = useState(false);
  const rouuter = useRouter();

  useEffect(() => {
    setLoading(true);
    setCurrentFile(cFile);
    setLoading(false);
  }, [cFile]);

  const handleNextRecord = async () => {
    if (!currentFile) return;
    const next = await nextRecord(currentFile.id);
    if (next) {
      setCurrentFile(next);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handlePrevRecord = async () => {
    if (!currentFile) return;
    const prev = await prevRecord(currentFile.id);
    if (prev) {
      setCurrentFile(prev);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!currentFile) return;
    await deleteMedia(id);
    rouuter.refresh();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[calc(100vw-100px)] h-[calc(100vh-100px)] content-start overflow-y-auto">
        {currentFile && (
          <>
            <div className="space-y-2 flex justify-between mt-4">
              <div>
                <DialogTitle>Media Files</DialogTitle>
                <DialogDescription>
                  My Media Files description
                </DialogDescription>
              </div>
              <div className="space-x-2">
                <Button variant={"outline"} onClick={handlePrevRecord}>
                  <ChevronLeft size={20} />
                </Button>
                <Button variant={"outline"} onClick={handleNextRecord}>
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-12 h-[calc(100vh-250px)]">
              <div className="col-span-12 lg:col-span-8 border border-border p-4">
                <Image
                  src={currentFile.fileUrl || ""}
                  alt={currentFile.fileName || ""}
                  width={500}
                  height={500}
                  className="w-auto h-full mx-auto"
                />
              </div>
              <div className="col-span-12 lg:col-span-4 bg-muted">
                <div className="p-6 text-muted-foreground">
                  <p className="text-sm font-medium">Uploaded on: </p>
                  <p className="text-xs mb-2">
                    {String(currentFile.createdAt)}
                  </p>
                  <p className="text-sm font-medium">Uploaded by: </p>
                  <p className="text-xs mb-2">{currentFile.uploadedBy}</p>
                  <p className="text-sm font-medium">File name: </p>
                  <p className="text-xs mb-2">{currentFile.fileName}</p>
                  <p className="text-sm font-medium">File type: </p>
                  <p className="text-xs mb-2">{currentFile.fileType}</p>
                  <p className="text-sm font-medium">File size: </p>
                  <p className="text-xs mb-2">
                    {formatBytes(currentFile.size || 0)}
                  </p>
                  {currentFile.width && currentFile.height && (
                    <>
                      <p className="text-sm font-medium">Dimensions:</p>
                      <p className="text-xs mb-2">
                        {currentFile.width} x {currentFile.height}
                      </p>
                    </>
                  )}

                  {currentFile.id && (
                    <MediaUpdateForm mediaFile={currentFile} />
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="link" className="text-destructive mt-2">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMedia(currentFile.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FileDialog;
