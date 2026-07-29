import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string({ message: "Category name is required" }),
  parentId: z.string().uuid().nullable().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
