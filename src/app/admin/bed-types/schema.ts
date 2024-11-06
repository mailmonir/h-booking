import { z } from "zod";

export const createBedTypeSchema = z.object({
  bed_type_name: z.string().min(3, "Required"),
});

export type CreateBedTypeSchemaType = z.infer<typeof createBedTypeSchema>;
