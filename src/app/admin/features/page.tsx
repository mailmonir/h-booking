import Link from "next/link";
import { Suspense } from "react";
import FeatureList from "./feature-list";
import Searchbar from "@/components/search";
import { getFeaturesCount } from "@/app/admin/features/actions";
import { Button } from "@/components/ui/button";
import FeatureListSkeletorn from "./feature-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function FeaturesPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const featuresCount = await getFeaturesCount();
  const pagesCount = Math.ceil(
    featuresCount / Number(process.env.FEATURE_PER_PAGE)
  );

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Features</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search features" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/features/create">
              <Button>New feature</Button>
            </Link>
          </div>
        </div>
        <Suspense
          key={srcQry + currentPage}
          fallback={<FeatureListSkeletorn />}
        >
          <FeatureList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={featuresCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
