import EditFloorForm from "./edit-floor-form";
import { getFloor } from "@/app/admin/floors/actions";

export default async function EditRoomStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const floor = await getFloor(id);
  console.log(floor, id);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {floor ? (
          <EditFloorForm floor={floor} />
        ) : (
          <p className="mx-auto text-center">No floor to edit</p>
        )}
      </div>
    </main>
  );
}
