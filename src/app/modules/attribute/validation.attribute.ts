import { z } from "zod";

const createAttributeSchema = z.object({
  name: z.string({ message: "Attribute name is required" }),
});

const updateAttributeSchema = z.object({
  name: z.string().optional(),
});

const createAttributeValueSchema = z.object({
  value: z.string({ message: "Value is required" }),
});

const updateAttributeValueSchema = z.object({
  value: z.string({ message: "Value is required" }),
});

export const attributeValidation = {
  createAttributeSchema,
  updateAttributeSchema,
  createAttributeValueSchema,
  updateAttributeValueSchema,
};
