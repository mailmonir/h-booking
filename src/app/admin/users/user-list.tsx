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
import { getFilteredUsers } from "@/app/admin/users/actions";
import Paginations from "@/components/pagination";
import ActionDropdown from "@/app/admin/action-dropdown";
import { deleteUser } from "@/app/admin/users/actions";
import { PaginationProps } from "@/lib/types";

const UserList = async ({
  srcqry,
  currentPage,
  pagesCount,
  itemsCount,
}: PaginationProps) => {
  const users = await getFilteredUsers(
    srcqry,
    currentPage,
    Number(process.env.USER_PER_PAGE)
  );

  const pagesCountSearch = Math.ceil(
    users.length / Number(process.env.USER_PER_PAGE)
  );

  const pcount = srcqry ? pagesCountSearch : pagesCount;
  const icount = srcqry ? users.length : itemsCount;

  if (users.length === 0) {
    return (
      <div className="text-center font-semibold text-xl">No user found</div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Image
                  src={
                    user?.avatarUrl[0] || "/images/cat-image-placeholder.jpg"
                  }
                  alt={user.name}
                  width={100}
                  height={100}
                  className="h-16 w-16 object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.providerId}</TableCell>
              <TableCell>
                {user.emailVerified === null
                  ? "-"
                  : user.emailVerified
                  ? "Yes"
                  : "No"}
              </TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  deleteItem={deleteUser}
                  id={user.id}
                  url={`/admin/users/edit/${user.id}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              {`Showing (${
                (currentPage - 1) * Number(process.env.USER_PER_PAGE) + 1
              } - ${
                users.length === Number(process.env.USER_PER_PAGE)
                  ? currentPage * Number(process.env.USER_PER_PAGE)
                  : currentPage * Number(process.env.USER_PER_PAGE) -
                    (Number(process.env.USER_PER_PAGE) - users.length)
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

export default UserList;
