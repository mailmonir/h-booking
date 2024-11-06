import Link from "next/link";
import { Suspense } from "react";
import PaymentStatusList from "./payment-status-list";
import Searchbar from "@/components/search";
import { getPaymentStatusCount } from "@/app/admin/payment-status/actions";
import { Button } from "@/components/ui/button";
import PaymentStatusListSkeleton from "./payment-status-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function PaymentStatusPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const paymentStatusCount = await getPaymentStatusCount();
  const pagesCount = Math.ceil(
    paymentStatusCount / Number(process.env.PAYMENT_STATUS_PER_PAGE)
  );

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Payment status</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search payment status" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/payment-status/create">
              <Button>New payment status</Button>
            </Link>
          </div>
        </div>
        <Suspense
          key={srcQry + currentPage}
          fallback={<PaymentStatusListSkeleton />}
        >
          <PaymentStatusList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={paymentStatusCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
