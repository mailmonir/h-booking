import { z } from "zod";

export const createRoomSchema = z.object({
  room_number: z.string().min(1, "Required"),
  room_class_id: z.string().min(1, "Required"),
  floor_id: z.string().min(1, "Required"),
  room_status_id: z.string().min(1, "Required"),
  room_images: z.array(z.string()),
});

export type CreateRoomSchemaType = z.infer<typeof createRoomSchema>;
