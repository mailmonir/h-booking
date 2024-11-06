import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { deleteUTFile } from "@/app/admin/products/actions";
import { Loader2 } from "lucide-react";

interface MyUploadDropZoneProps {
  setValue: any;
  setError: any;
  clearErrors: any;
  endpoint: any;
  fieldName: string;
  existingImages?: string[];
}

const MyUploadDropZone = ({
  setValue,
  setError,
  clearErrors,
  endpoint,
  fieldName,
  existingImages,
}: MyUploadDropZoneProps) => {
  const [previewedImage, setPreviewedImage] = useState<string[]>(
    existingImages ? existingImages : []
  );
  const [loading, setLoading] = useState(false);

  const handleImageDelete = async (url: string) => {
    setLoading(true);
    const res = await deleteUTFile(url.split("8e7hjlnxcw/")[1]);
    if (res) {
      setPreviewedImage(previewedImage.filter((image) => image !== url));
      setValue(
        fieldName,
        previewedImage.filter((image) => image !== url)
      );
    }
    setLoading(false);
  };
  return (
    <>
      <div>
        <UploadDropzone
          endpoint={endpoint}
          // onBeforeUploadBegin={(files) => {
          //   return files.map(
          //     (f) => new File([f], "renamed-" + f.name, { type: f.type }),
          //   );
          // }}
          onClientUploadComplete={(res) => {
            const newRes = res.map((file) =>
              file.url.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
              )
            );
            setPreviewedImage([...previewedImage, ...newRes]);
            setValue(fieldName, previewedImage, { shouldDirty: true });
            console.log(newRes);
          }}
          onUploadError={(error: Error) => {
            setError(fieldName, {
              message: error.message,
            });
          }}
          onUploadBegin={() => {
            clearErrors(fieldName);
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2 !mt-4">
        {previewedImage.length > 0 &&
          previewedImage?.map((url, index) => (
            <div
              key={index}
              className="border border-border p-1 rounded-sm inline-block relative group"
            >
              <Image
                src={url}
                alt="preview"
                width={500}
                height={500}
                className="w-[200px] h-auto"
              />
              <span
                className="hidden absolute top-2 right-2 cursor-pointer hover:text-red-500 group-hover:block bg-gray-50/20 hover:bg-gray-50/50"
                onClick={() => handleImageDelete(url)}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <X size={20} />
                )}
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default MyUploadDropZone;
