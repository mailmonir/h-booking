import EditUserForm from "./edit-user-form";
import { getUser } from "@/app/admin/users/actions";

export default async function EditCategory({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser(params.id);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {user ? (
          <EditUserForm user={user} />
        ) : (
          <p className="mx-auto">No user found</p>
        )}
      </div>
    </main>
  );
}
