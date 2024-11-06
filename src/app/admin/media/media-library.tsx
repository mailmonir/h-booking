import Paginations from "@/components/pagination";
import type { PaginationProps } from "@/lib/types";
import { getFilteredMedia } from "@/app/admin/media/media-action";
import RenderMediaFiles from "./render-media-files";

const MediaLibrary = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const mediaFiles = await getFilteredMedia(
    srcqry,
    currentPage,
    Number(process.env.MEDIA_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    mediaFiles.length / Number(process.env.MEDIA_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? mediaFiles.length : itemsCount;

  return (
    <div className="p-5 border border-border rounded-md">
      {mediaFiles.length > 0 ? (
        <>
          <RenderMediaFiles mediaFiles={mediaFiles} />

          <div className="text-sm text-muted-foreground flex justify-between mt-4 border-t border-border pt-4">
            <span>{`Showing (${
              (currentPage - 1) * Number(process.env.MEDIA_PER_PAGE) + 1
            } - ${
              mediaFiles.length === Number(process.env.MEDIA_PER_PAGE)
                ? currentPage * Number(process.env.MEDIA_PER_PAGE)
                : currentPage * Number(process.env.MEDIA_PER_PAGE) -
                  (Number(process.env.MEDIA_PER_PAGE) - mediaFiles.length)
            }) of ${icount}`}</span>
            <span>
              Page {currentPage} of {pcount}
            </span>
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">
          No media files available
        </p>
      )}
      {pcount > 1 && (
        <div className="mt-8">
          <Paginations totalPages={pagesCount} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
