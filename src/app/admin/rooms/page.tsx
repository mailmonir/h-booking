import Link from "next/link";
import { Suspense } from "react";
import RoomList from "./room-list";
import Searchbar from "@/components/search";
import { getRoomCount } from "@/app/admin/rooms/actions";
import { Button } from "@/components/ui/button";
import RoomListSkeletorn from "./room-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function RoomPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const roomCount = await getRoomCount();
  const pagesCount = Math.ceil(roomCount / Number(process.env.ROOM_PER_PAGE));

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Rooms</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search room" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/rooms/create">
              <Button>New room</Button>
            </Link>
          </div>
        </div>
        <Suspense key={srcQry + currentPage} fallback={<RoomListSkeletorn />}>
          <RoomList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={roomCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
