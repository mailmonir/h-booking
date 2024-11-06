import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFilteredAddon } from "@/app/admin/addons/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteAddon } from "@/app/admin/addons/actions";
import { PaginationProps } from "@/lib/types";

const AddonList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const addons = await getFilteredAddon(
    srcqry,
    currentPage,
    Number(process.env.ADDON_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    addons.length / Number(process.env.ADDON_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? addons.length : itemsCount;

  if (addons.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">No addon found</div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="font-medium text-foreground">
          <TableRow className="">
            <TableHead className="">Addon name</TableHead>
            <TableHead className="">Slug</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground/80">
          {addons.map((addon) => (
            <TableRow key={addon.id}>
              <TableCell className="">{addon.addon_name}</TableCell>
              <TableCell>{addon.slug}</TableCell>
              <TableCell className="text-right">{addon.price}</TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteAddon}
                  id={addon.id}
                  url={`/admin/addons/edit/${addon.slug}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-muted-foreground text-xs font-normal">
          <TableRow>
            <TableCell colSpan={3}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.ADDON_PER_PAGE) + 1
              } - ${
                addons.length === Number(process.env.ADDON_PER_PAGE)
                  ? currentPage * Number(process.env.ADDON_PER_PAGE)
                  : currentPage * Number(process.env.ADDON_PER_PAGE) -
                    (Number(process.env.ADDON_PER_PAGE) - addons.length)
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
