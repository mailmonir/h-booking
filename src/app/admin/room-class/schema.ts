import { z } from "zod";

const bedSchema = z
  .object({
    bedtype: z.string().min(1, "Required"),
    numberOfBeds: z.string().min(1, "Required"),
  })
  .refine(
    (data) => {
      return Number(data.numberOfBeds) > 0 && Number(data.numberOfBeds) < 4
        ? true
        : false;
    },
    {
      message: "Must be between 1 and 3",
      path: ["numberOfBeds"],
    }
  );

export const createRoomClassSchema = z.object({
  class_name: z.string().min(3, "Required"),
  base_price: z.preprocess(
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
  image: z.array(z.string()),
  description: z.string().optional(),
  features: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one feature.",
  }),
  bedTypes: z.array(bedSchema).refine(
    (items) => {
      const names = items.map((item) => item.bedtype);
      return new Set(names).size === names.length;
    },
    {
      message: "Duplicate bed type",
      // path: [], // Optional, can set the path to where the error should display
    }
  ),
});

export type CreateRoomClassSchemaType = z.infer<typeof createRoomClassSchema>;
