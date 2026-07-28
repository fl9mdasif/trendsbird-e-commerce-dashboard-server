import { z } from "zod";

const loginSchema = z.object({
  email: z.string({ message: "Email is required" }).email("Invalid email format"),
  password: z.string({ message: "Password is required" }),
});

const refreshSchema = z.object({
  refreshToken: z.string({ message: "Refresh token is required" }),
});

export const authValidation = {
  loginSchema,
  refreshSchema,
};
