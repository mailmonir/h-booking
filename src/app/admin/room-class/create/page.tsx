import CreateRoomClassForm from "./create-room-class-form";
import { getFeatures } from "@/app/admin/features/actions";
import { getBedTypes } from "@/app/admin/bed-types/actions";

export default async function CreateCategory() {
  const features = await getFeatures();
  const bedTypes = await getBedTypes();
  return (
    <main>
      <div className="max-w-2xl mx-auto">
        <CreateRoomClassForm features={features} bedTypes={bedTypes} />
      </div>
    </main>
  );
}
