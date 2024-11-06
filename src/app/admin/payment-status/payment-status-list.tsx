import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredPaymentStatus } from "@/app/admin/payment-status/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deletePaymentStatus } from "@/app/admin/payment-status/actions";
import { PaginationProps } from "@/lib/types";

const AddonList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const paymentStatuses = await getFilteredPaymentStatus(
    srcqry,
    currentPage,
    Number(process.env.PAYMENT_STATUS_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    paymentStatuses.length / Number(process.env.PAYMENT_STATUS_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? paymentStatuses.length : itemsCount;

  if (paymentStatuses.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">
        No payment status found
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead className="">Payment status</TableHead>
            <TableHead className="">Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {paymentStatuses.map((paymentStatus) => (
            <TableRow key={paymentStatus.id}>
              <TableCell className="">
                {paymentStatus.payment_status_name}
              </TableCell>
              <TableCell>{paymentStatus.slug}</TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deletePaymentStatus}
                  id={paymentStatus.id}
                  url={`/admin/payment-status/edit/${paymentStatus.slug}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow>
            <TableCell colSpan={2}>
              {`Showing (${
                (currentPage - 1) *
                  Number(process.env.PAYMENT_STATUS_PER_PAGE) +
                1
              } - ${
                paymentStatuses.length ===
                Number(process.env.PAYMENT_STATUS_PER_PAGE)
                  ? currentPage * Number(process.env.PAYMENT_STATUS_PER_PAGE)
                  : currentPage * Number(process.env.PAYMENT_STATUS_PER_PAGE) -
                    (Number(process.env.PAYMENT_STATUS_PER_PAGE) -
                      paymentStatuses.length)
              }) of ${icount}`}
            </TableCell>
            <TableCell className="text-right min-w-28">
              Page {currentPage} of {pcount}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {pcount > 1 && (
        <div className="mt-8">
          <Paginations totalPages={pagesCount} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
};

export default AddonList;
