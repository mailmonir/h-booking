import { z } from "zod";

export const createFeatureSchema = z.object({
  feature_name: z.string().min(1, "Required"),
});

export type CreateFeatureSchemaType = z.infer<typeof createFeatureSchema>;
