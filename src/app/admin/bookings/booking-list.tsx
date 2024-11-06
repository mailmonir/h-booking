import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredRoom } from "@/app/admin/rooms/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteRoom } from "@/app/admin/rooms/actions";
import { PaginationProps } from "@/lib/types";
import Image from "next/image";

const RoomList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const rooms = await getFilteredRoom(
    srcqry,
    currentPage,
    Number(process.env.ROOM_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    rooms.length / Number(process.env.ROOM_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? rooms.length : itemsCount;

  if (rooms.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">No Room found</div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead>Image</TableHead>
            <TableHead className="">Room number</TableHead>
            <TableHead className="">Roo class</TableHead>
            <TableHead className="">Floor</TableHead>
            <TableHead className="">Room status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>
                <Image
                  src={room?.room_images[0] || "/images/image-placeholder.jpg"}
                  alt={room.room_class.class_name}
                  width={100}
                  height={100}
                  className="h-16 w-16 object-cover"
                />
              </TableCell>
              <TableCell className="">{room.room_number}</TableCell>
              <TableCell className="">{room.room_class.class_name}</TableCell>
              <TableCell className="">{room.floor.floor_number}</TableCell>
              <TableCell className="">{room.room_status.status_name}</TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteRoom}
                  id={room.id}
                  url={`/admin/rooms/edit/${room.id}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow>
            <TableCell colSpan={5}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.ROOM_PER_PAGE) + 1
              } - ${
                rooms.length === Number(process.env.ROOM_PER_PAGE)
                  ? currentPage * Number(process.env.ROOM_PER_PAGE)
                  : currentPage * Number(process.env.ROOM_PER_PAGE) -
                    (Number(process.env.ROOM_PER_PAGE) - rooms.length)
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

export default RoomList;
