import Link from "next/link";
import { Suspense } from "react";
import FloorList from "./floor-list";
import Searchbar from "@/components/search";
import { getFloorCount } from "@/app/admin/floors/actions";
import { Button } from "@/components/ui/button";
import FloorListSkeletorn from "./floor-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function FloorPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const floorCount = await getFloorCount();
  const pagesCount = Math.ceil(floorCount / Number(process.env.FLOOR_PER_PAGE));

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Floors</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search floor" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/floors/create">
              <Button>New floor</Button>
            </Link>
          </div>
        </div>
        <Suspense key={srcQry + currentPage} fallback={<FloorListSkeletorn />}>
          <FloorList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={floorCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
