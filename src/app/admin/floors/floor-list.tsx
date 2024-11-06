import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredFloor } from "@/app/admin/floors/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteFloor } from "@/app/admin/floors/actions";
import { PaginationProps } from "@/lib/types";

const RoomStatusList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const floors = await getFilteredFloor(
    srcqry,
    currentPage,
    Number(process.env.FLOOR_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    floors.length / Number(process.env.FLOOR_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? floors.length : itemsCount;

  if (floors.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">No floor found</div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead className="">Floor number</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {floors.map((floor) => (
            <TableRow key={floor.id}>
              <TableCell className="">{floor.floor_number}</TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteFloor}
                  id={floor.id}
                  url={`/admin/floors/edit/${floor.id}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow>
            <TableCell colSpan={1}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.FLOOR_PER_PAGE) + 1
              } - ${
                floors.length === Number(process.env.FLOOR_PER_PAGE)
                  ? currentPage * Number(process.env.FLOOR_PER_PAGE)
                  : currentPage * Number(process.env.FLOOR_PER_PAGE) -
                    (Number(process.env.FLOOR_PER_PAGE) - floors.length)
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

export default RoomStatusList;
