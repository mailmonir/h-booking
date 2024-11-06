import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredRoomStatus } from "@/app/admin/room-status/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteRoomStatus } from "@/app/admin/room-status/actions";
import { PaginationProps } from "@/lib/types";

const RoomStatusList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const roomStatuses = await getFilteredRoomStatus(
    srcqry,
    currentPage,
    Number(process.env.ROOM_STATUS_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    roomStatuses.length / Number(process.env.ROOM_STATUS_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? roomStatuses.length : itemsCount;

  if (roomStatuses.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">
        No room status found
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead className="">Room status name</TableHead>
            <TableHead className="">Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {roomStatuses.map((roomStatus) => (
            <TableRow key={roomStatus.id}>
              <TableCell className="">{roomStatus.status_name}</TableCell>
              <TableCell>{roomStatus.slug}</TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteRoomStatus}
                  id={roomStatus.id}
                  url={`/admin/room-status/edit/${roomStatus.slug}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow>
            <TableCell colSpan={2}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.ROOM_STATUS_PER_PAGE) + 1
              } - ${
                roomStatuses.length === Number(process.env.ROOM_STATUS_PER_PAGE)
                  ? currentPage * Number(process.env.ROOM_STATUS_PER_PAGE)
                  : currentPage * Number(process.env.ROOM_STATUS_PER_PAGE) -
                    (Number(process.env.ROOM_STATUS_PER_PAGE) -
                      roomStatuses.length)
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
