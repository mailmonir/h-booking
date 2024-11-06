import Link from "next/link";
import { Suspense } from "react";
import BedList from "./bed-list";
import Searchbar from "@/components/search";
import { getBedTypesCount } from "@/app/admin/bed-types/actions";
import { Button } from "@/components/ui/button";
import BedListSkeletorn from "./bed-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function BedTypePage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const bedsCount = await getBedTypesCount();
  const pagesCount = Math.ceil(bedsCount / Number(process.env.BED_PER_PAGE));

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Bed types</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search bed types" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/bed-types/create">
              <Button>New bed type</Button>
            </Link>
          </div>
        </div>
        <Suspense key={srcQry + currentPage} fallback={<BedListSkeletorn />}>
          <BedList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={bedsCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
