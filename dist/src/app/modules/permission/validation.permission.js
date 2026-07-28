"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionValidation = void 0;
const zod_1 = require("zod");
const createPermissionSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }),
    description: zod_1.z.string().optional(),
});
const updatePermissionSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.permissionValidation = {
    createPermissionSchema,
    updatePermissionSchema,
};
//# sourceMappingURL=validation.permission.js.map