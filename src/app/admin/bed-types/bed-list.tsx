import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredBedTypes } from "@/app/admin/bed-types/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteBedType } from "@/app/admin/bed-types/actions";
import { PaginationProps } from "@/lib/types";

const BedList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const beds = await getFilteredBedTypes(
    srcqry,
    currentPage,
    Number(process.env.Bed_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    beds.length / Number(process.env.Bed_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? beds.length : itemsCount;

  if (beds.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">No bed found</div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead className="">Bed type name</TableHead>
            <TableHead className="">Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {beds.map((bed) => (
            <TableRow key={bed.id}>
              <TableCell className="">{bed.bed_type_name}</TableCell>
              <TableCell>{bed.slug}</TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteBedType}
                  id={bed.id}
                  url={`/admin/bed-types/edit/${bed.slug}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow>
            <TableCell colSpan={2}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.Bed_PER_PAGE) + 1
              } - ${
                beds.length === Number(process.env.Bed_PER_PAGE)
                  ? currentPage * Number(process.env.Bed_PER_PAGE)
                  : currentPage * Number(process.env.Bed_PER_PAGE) -
                    (Number(process.env.Bed_PER_PAGE) - beds.length)
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

export default BedList;
