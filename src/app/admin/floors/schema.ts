import { z } from "zod";

export const createFloorSchema = z.object({
  floor_number: z.string().min(1, "Required"),
});

export type CreateFloorSchemaType = z.infer<typeof createFloorSchema>;
