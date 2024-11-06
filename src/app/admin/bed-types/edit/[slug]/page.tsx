import EditBedTypeForm from "./edit-bed-form";
import { getBedType } from "@/app/admin/bed-types/actions";

export default async function EditBedTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const bedType = await getBedType(slug);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {bedType ? (
          <EditBedTypeForm bedType={bedType} />
        ) : (
          <p className="mx-auto text-center">No bed type to edit</p>
        )}
      </div>
    </main>
  );
}
