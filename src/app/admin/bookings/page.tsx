import Link from "next/link";
import { Suspense } from "react";
import BookingList from "./booking-list";
import Searchbar from "@/components/search";
import { getBookingCount } from "@/app/admin/bookings/actions";
import { Button } from "@/components/ui/button";
import BookingListSkeletorn from "./booking-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function BookingPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const bookingCount = await getBookingCount();
  const pagesCount = Math.ceil(
    bookingCount / Number(process.env.Booking_PER_PAGE)
  );

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Bookings</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search booking" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/bookings/create">
              <Button>New booking</Button>
            </Link>
          </div>
        </div>
        <Suspense
          key={srcQry + currentPage}
          fallback={<BookingListSkeletorn />}
        >
          <BookingList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={bookingCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
