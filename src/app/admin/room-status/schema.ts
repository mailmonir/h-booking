import { z } from "zod";

export const createRoomStatusSchema = z.object({
  status_name: z.string().min(3, "Required"),
});

export type CreateRoomStatusSchemaType = z.infer<typeof createRoomStatusSchema>;
