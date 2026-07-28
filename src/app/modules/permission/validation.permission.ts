import { z } from "zod";

const createPermissionSchema = z.object({
  name: z.string({ message: "Name is required" }),
  description: z.string().optional(),
});

const updatePermissionSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const permissionValidation = {
  createPermissionSchema,
  updatePermissionSchema,
};
