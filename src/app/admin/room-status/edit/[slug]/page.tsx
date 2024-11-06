import EditRoomStatusForm from "./edit-room-status-form";
import { getRoomStatus } from "@/app/admin/room-status/actions";

export default async function EditRoomStatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const roomStatus = await getRoomStatus(slug);

  return (
    <main>
      <div className="max-w-2xl mx-auto">
        {roomStatus ? (
          <EditRoomStatusForm roomStatus={roomStatus} />
        ) : (
          <p className="mx-auto text-center">No room status to edit</p>
        )}
      </div>
    </main>
  );
}
