"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string({ message: "Email is required" }).email("Invalid email format"),
    password: zod_1.z.string({ message: "Password is required" }),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({ message: "Refresh token is required" }),
});
exports.authValidation = {
    loginSchema,
    refreshSchema,
};
//# sourceMappingURL=validation.auth.js.map