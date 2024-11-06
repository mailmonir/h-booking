import EditRoomClassForm from "./edit-room-class-form";
import { getFeatures } from "@/app/admin/features/actions";
import { getBedTypes } from "@/app/admin/bed-types/actions";
import { getRoomClass } from "../../actions";

export default async function EditRoomClassPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const features = await getFeatures();
  const bedTypes = await getBedTypes();
  const slug = (await params).slug;
  const roomClass = await getRoomClass(slug);
  if (!roomClass) {
    return (
      <div className="text-center font-medium text-foreground">
        Room class not found
      </div>
    );
  }
  return (
    <main>
      <div className="max-w-2xl mx-auto">
        <EditRoomClassForm
          features={features}
          bedTypes={bedTypes}
          roomClass={roomClass}
        />
      </div>
    </main>
  );
}
