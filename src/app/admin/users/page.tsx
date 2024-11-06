import Link from "next/link";
import { Suspense } from "react";
import UserList from "./user-list";
import Searchbar from "@/components/search";
import { getUsersCount } from "@/app/admin/users/actions";
import { Button } from "@/components/ui/button";
import UserListSkeletorn from "./user-list-skeleton";
import { PageProps } from "@/lib/types";

export default async function UsersPage(props: PageProps) {
  const params = await props.searchParams;
  const srcQry = Array.isArray(params?.query)
    ? params?.query.join(" ")
    : params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const usersCount = await getUsersCount();
  const pagesCount = Math.ceil(usersCount / Number(process.env.USER_PER_PAGE));

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl font-bold">Users</h2>
        <div className="flex justify-between pb-8 items-center">
          <Searchbar placeholder="Search users" />
          <div className="flex-1 flex justify-end">
            <Link href="/admin/users/create">
              <Button>New user</Button>
            </Link>
          </div>
        </div>
        <Suspense key={srcQry + currentPage} fallback={<UserListSkeletorn />}>
          <UserList
            srcqry={srcQry}
            currentPage={currentPage}
            pagesCount={pagesCount}
            itemsCount={usersCount}
          />
        </Suspense>
      </div>
    </main>
  );
}
