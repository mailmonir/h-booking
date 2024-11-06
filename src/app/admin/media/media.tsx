import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import MediaInserter from "./media-inserter";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Media = ({
  multiple = false,
  onChange,
  existingImages,
}: {
  multiple?: boolean;
  onChange: (images: string[]) => void;
  existingImages?: string[];
}) => {
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>(
    existingImages || []
  );

  useEffect(() => {
    onChange(selectedImages);
  }, [selectedImages, onChange]);

  return (
    <>
      <div className="w-full h-full">
        <div
          className={cn(
            "border-2 border-border border-dashed inline-flex items-center justify-center rounded-md",
            selectedImages.length === 0 ? "min-w-[200px] min-h-[200px]" : ""
          )}
        >
          <Button
            className={cn(selectedImages.length > 0 ? "hidden" : "")}
            type="button"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            Select image{multiple ? "s" : ""}
          </Button>

          <MediaInserter
            open={open}
            setOpen={setOpen}
            setSelectedImages={setSelectedImages}
            multiple={multiple}
          />
          {selectedImages.length > 0 && (
            <div
              className={cn(
                "p-2 w-full h-full",
                multiple ? "flex flex-wrap gap-2" : ""
              )}
            >
              {selectedImages.map((image, index) => (
                <div className="relative group" key={index}>
                  <Image
                    src={image}
                    alt="image"
                    width={300}
                    height={300}
                    className="w-[157px] h-[140px] inline-block object-cover"
                  />
                  <span className="absolute right-0 top-0 hidden group-hover:inline-block bg-destructive/20 group-hover:text-destructive cursor-pointer">
                    <X
                      size={18}
                      onClick={() =>
                        setSelectedImages((prev) =>
                          prev.filter((i) => i !== image)
                        )
                      }
                    />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-4">
        <Button
          variant="link"
          type="button"
          className={cn(
            "text-xs text-muted-foreground p-0 m-0",
            selectedImages.length > 0 ? "" : "hidden"
          )}
          onClick={() => setOpen(true)}
        >
          {multiple ? "Add image" : "Change image"}
        </Button>
        <Button
          variant="link"
          type="button"
          className={cn(
            "text-xs text-muted-foreground p-0 m-0",
            selectedImages.length > 0 ? "" : "hidden"
          )}
          onClick={() => setSelectedImages([])}
        >
          Remove image{multiple ? "s" : ""}
        </Button>
      </div>
    </>
  );
};

export default Media;
