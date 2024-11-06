import MediaUploader from "./media-uploader";
import Searchbar from "@/components/search";
import MediaLibrary from "./media-library";
import { ImageSkeleton } from "./image-skeleton";
import { Suspense } from "react";
import { PageProps } from "@/lib/types";
import { getMediaCount } from "@/app/admin/media/media-action";
import { getCurrentSession } from "@/lib/server/session";

const MediaPage = async (props: PageProps) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return (
      <main>
        <div className="max-w-7xl mx-auto space-y-10">
          <h2 className="text-xl font-bold">Media</h2>
          <p>You are not authorized to access this page.</p>
        </div>
      </main>
    );
  }
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;
  const itemsCount = await getMediaCount();
  const pagesCount = Math.ceil(itemsCount / Number(process.env.MEDIA_PER_PAGE));

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Media</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search media" />
        </div>
        <MediaUploader />

        <Suspense key={srcQry + currentPage} fallback={<ImageSkeleton />}>
          <MediaLibrary
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={itemsCount}
          />
        </Suspense>
      </div>
    </main>
  );
};

export default MediaPage;
