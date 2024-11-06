import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredRoomClasses } from "@/app/admin/room-class/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteRoomClass } from "@/app/admin/room-class/actions";
import { PaginationProps } from "@/lib/types";

const CategoryList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const roomClasses = await getFilteredRoomClasses(
    srcqry,
    currentPage,
    Number(process.env.ROOM_CLASS_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    roomClasses.length / Number(process.env.ROOM_CLASS_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? roomClasses.length : itemsCount;

  if (roomClasses.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">
        No room class found
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="text-foreground font-medium">
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Room Class</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Base Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-muted-foreground font-normal">
          {roomClasses.map((roomClass) => (
            <TableRow key={roomClass.id}>
              <TableCell>
                <Image
                  src={roomClass?.image[0] || "/images/image-placeholder.jpg"}
                  alt={roomClass.class_name}
                  width={100}
                  height={100}
                  className="h-16 w-16 object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">
                {roomClass.class_name}
              </TableCell>
              <TableCell>{roomClass.slug}</TableCell>
              <TableCell>{roomClass.description}</TableCell>
              <TableCell className="text-right">
                {roomClass.base_price}
              </TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteRoomClass}
                  id={roomClass.id}
                  url={`/admin/room-class/edit/${roomClass.slug}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs">
          <TableRow>
            <TableCell colSpan={5}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.ROOM_CLASS_PER_PAGE) + 1
              } - ${
                roomClasses.length === Number(process.env.ROOM_CLASS_PER_PAGE)
                  ? currentPage * Number(process.env.ROOM_CLASS_PER_PAGE)
                  : currentPage * Number(process.env.ROOM_CLASS_PER_PAGE) -
                    (Number(process.env.ROOM_CLASS_PER_PAGE) -
                      roomClasses.length)
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

export default CategoryList;
