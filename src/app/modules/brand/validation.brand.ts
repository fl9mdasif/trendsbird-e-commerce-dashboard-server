import { z } from "zod";

const createBrandSchema = z.object({
  name: z.string({ message: "Brand name is required" }),
});

const updateBrandSchema = z.object({
  name: z.string().optional(),
});

export const brandValidation = {
  createBrandSchema,
  updateBrandSchema,
};
