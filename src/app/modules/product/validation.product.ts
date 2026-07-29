import { z } from "zod";

const variantAttributeSchema = z.object({
  attributeId: z.string().uuid("Invalid Attribute ID"),
  attributeValueId: z.string().uuid("Invalid Attribute Value ID"),
});

const variantInputSchema = z.object({
  price: z.number({ message: "Variant price is required" }).positive(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number({ message: "Variant stock is required" }).int().nonnegative(),
  sku: z.string({ message: "Variant SKU is required" }),
  attributes: z.array(variantAttributeSchema).min(1, "Variant must have at least one attribute"),
});

const createProductSchema = z.object({
  name: z.string({ message: "Product name is required" }),
  description: z.string().optional().nullable(),
  hasVariants: z.boolean().default(false),
  price: z.number().positive().optional().nullable(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative().optional().nullable(),
  sku: z.string().optional().nullable(),
  brandId: z.string().uuid().optional().nullable(),
  categoryIds: z.array(z.string().uuid()).min(1, "Product must belong to at least one category"),
  mediaIds: z.array(z.string().uuid()).optional().default([]),
  variants: z.array(variantInputSchema).optional().default([]),
});

const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  hasVariants: z.boolean().optional(),
  price: z.number().positive().optional().nullable(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative().optional().nullable(),
  sku: z.string().optional().nullable(),
  brandId: z.string().uuid().optional().nullable(),
  categoryIds: z.array(z.string().uuid()).optional(),
  mediaIds: z.array(z.string().uuid()).optional(),
  variants: z.array(variantInputSchema).optional(),
});

export const productValidation = {
  createProductSchema,
  updateProductSchema,
};
