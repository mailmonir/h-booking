import EditRoomForm from "./edit-room-form";
import { getRoom } from "@/app/admin/rooms/actions";

export default async function EditRoomStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const room = await getRoom(id);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {room ? (
          <EditRoomForm room={room} />
        ) : (
          <p className="mx-auto text-center">No room to edit</p>
        )}
      </div>
    </main>
  );
}
