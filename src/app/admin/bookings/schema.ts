import { z } from "zod";

export const createBookingSchema = z
  .object({
    guest_id: z.string().min(1, "Required"),
    room_id: z.string().min(1, "Required"),
    payment_status_id: z.string().min(1, "Required"),
    check_in_date: z
      .date()
      .refine((date) => date !== null && !isNaN(date.getTime()), {
        message: "Date is required",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset today's time to midnight
          return date >= today;
        },
        {
          message: "Past date not allowed",
        }
      ),

    check_out_date: z
      .date()
      .refine((date) => date !== null && !isNaN(date.getTime()), {
        message: "Date is required",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset today's time to midnight
          return date >= today;
        },
        {
          message: "Past date not allowed",
        }
      ),
    num_adults: z.preprocess(
      (value) => Number(value),
      z
        .number()
        .min(1, "Required")
        .max(10, { message: "Price must not exceed 10" })
        .refine((val) => val === 0 || val > 0, {
          message: "Must be positive or zero.",
        })
    ),
    num_children: z.preprocess(
      (value) => Number(value),
      z
        .number()
        .min(1, "Required")
        .max(10, { message: "Price must not exceed 10" })
        .refine((val) => val === 0 || val > 0, {
          message: "Must be positive or zero.",
        })
    ),
    booking_amount: z.preprocess(
      (value) => Number(value),
      z
        .number()
        .min(1, "Required")
        .max(1000, { message: "Price must not exceed 1000" })
        .refine((val) => val === 0 || val > 0, {
          message: "Must be positive or zero.",
        })
        .refine((val) => Number.isInteger(val * 100), {
          message: "Two decimal places only.",
        })
    ),

    addOns: z.array(
      z.object({
        addon_name: z.string().min(1, "Required"),
        price: z.preprocess(
          (value) => Number(value),
          z
            .number()
            .max(1000, { message: "Price must not exceed 1000" })
            .refine((val) => val > 0, {
              message: "Must be positive.",
            })
            .refine((val) => Number.isInteger(val * 100), {
              message: "Two decimal places only.",
            })
        ),
      })
    ),
  })
  .refine((data) => data.check_out_date >= data.check_in_date, {
    message: "Checkout date cannot be before checkin date",
    path: ["check_out_date"], // The error message will be shown for the checkout field
  });

export type CreateBookingSchemaType = z.infer<typeof createBookingSchema>;
