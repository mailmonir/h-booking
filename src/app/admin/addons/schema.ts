import { z } from "zod";

export const createAddonsSchema = z.object({
  addon_name: z.string().min(3, "Required"),
  price: z.preprocess(
    (value) => Number(value),
    z
      .number()
      .max(10000, { message: "Price must not exceed 1000" })
      .refine((val) => val === 0 || val > 0, {
        message: "Price must be a positive number or zero.",
      })
      .refine((val) => Number.isInteger(val * 100), {
        message: "Price can have at most two decimal places.",
      })
  ),
});

export type CreateAddonsSchemaType = z.infer<typeof createAddonsSchema>;
