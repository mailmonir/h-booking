import EditAddonForm from "./edit-addons-form";
import { getAddon } from "@/app/admin/addons/actions";

export default async function EditAddonsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const addon = await getAddon(slug);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {addon ? (
          <EditAddonForm addon={addon} />
        ) : (
          <p className="mx-auto text-center">No addon to edit</p>
        )}
      </div>
    </main>
  );
}
