import { z } from "zod";

const createRoleSchema = z.object({
  name: z.string({ message: "Name is required" }),
  description: z.string().optional(),
});

const updateRoleSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

const assignPermissionSchema = z.object({
  permissionId: z.string({ message: "Permission ID is required" }),
});

export const roleValidation = {
  createRoleSchema,
  updateRoleSchema,
  assignPermissionSchema,
};
