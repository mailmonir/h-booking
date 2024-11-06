import z from "zod";

export const updateMediaSchema = z.object({
  altText: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  title: z.string().optional(),
});
