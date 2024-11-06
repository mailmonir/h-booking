import Link from "next/link";
import { Suspense } from "react";
import RoomClassList from "./room-class-list";
import Searchbar from "@/components/search";
import { getRoomClassCount } from "@/app/admin/room-class/actions";
import { Button } from "@/components/ui/button";
import RoomClassCategoryListSkeletorn from "./room-class-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function CategoryPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const roomClassCount = await getRoomClassCount();
  const pagesCount = Math.ceil(
    roomClassCount / Number(process.env.ROOM_CLASS_PER_PAGE)
  );

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Room classes</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search room class" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/room-class/create">
              <Button>New room class</Button>
            </Link>
          </div>
        </div>
        <Suspense
          key={srcQry + currentPage}
          fallback={<RoomClassCategoryListSkeletorn />}
        >
          <RoomClassList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={roomClassCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
