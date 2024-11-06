import Link from "next/link";
import { Suspense } from "react";
import RoomStatusList from "./room-status-list";
import Searchbar from "@/components/search";
import { getRoomStatusCount } from "@/app/admin/room-status/actions";
import { Button } from "@/components/ui/button";
import RoomStatusListSkeletorn from "./room-status-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function RoomStatusPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const roomStatusCount = await getRoomStatusCount();
  const pagesCount = Math.ceil(
    roomStatusCount / Number(process.env.ROOM_STATUS_PER_PAGE)
  );

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Room status</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search room status" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/room-status/create">
              <Button>New room status</Button>
            </Link>
          </div>
        </div>
        <Suspense
          key={srcQry + currentPage}
          fallback={<RoomStatusListSkeletorn />}
        >
          <RoomStatusList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={roomStatusCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
