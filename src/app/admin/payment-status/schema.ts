import { z } from "zod";

export const createPaymentStatusSchema = z.object({
  payment_status_name: z.string().min(3, "Required"),
});

export type CreatePaymentStatusSchemaType = z.infer<
  typeof createPaymentStatusSchema
>;
