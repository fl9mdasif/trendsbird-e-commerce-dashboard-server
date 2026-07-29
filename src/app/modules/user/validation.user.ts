import { z } from "zod";

const createUserSchema = z.object({
  email: z.string({ message: "Email is required" }).email("Invalid email format"),
  password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
  name: z.string({ message: "Name is required" }),
  active: z.boolean().default(true),
  roleId: z.string({ message: "Role ID is required" }),
});

const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  name: z.string().optional(),
  active: z.boolean().optional(),
  roleId: z.string().optional(),
});

export const userValidation = {
  createUserSchema,
  updateUserSchema,
};
