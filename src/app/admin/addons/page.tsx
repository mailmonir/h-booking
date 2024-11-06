import Link from "next/link";
import { Suspense } from "react";
import AddonList from "./addons-list";
import Searchbar from "@/components/search";
import { getAddonCount } from "@/app/admin/addons/actions";
import { Button } from "@/components/ui/button";
import AddonListSkeleton from "./addons-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function AddonPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const addonCount = await getAddonCount();
  const pagesCount = Math.ceil(addonCount / Number(process.env.ADDON_PER_PAGE));

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Addons</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search addon" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/addons/create">
              <Button>New addon</Button>
            </Link>
          </div>
        </div>
        <Suspense key={srcQry + currentPage} fallback={<AddonListSkeleton />}>
          <AddonList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={addonCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
