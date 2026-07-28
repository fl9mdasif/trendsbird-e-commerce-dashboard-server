"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_permission_1 = require("./controller.permission");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_permission_1 = require("./validation.permission");
const router = express_1.default.Router();
router.post("/", auth_1.authMiddleware, (0, auth_1.requirePermission)("permission:create"), (0, validateRequest_1.default)(validation_permission_1.permissionValidation.createPermissionSchema), controller_permission_1.permissionController.createPermission);
router.get("/", auth_1.authMiddleware, (0, auth_1.requirePermission)("permission:read"), controller_permission_1.permissionController.getAllPermissions);
router.get("/:id", auth_1.authMiddleware, (0, auth_1.requirePermission)("permission:read"), controller_permission_1.permissionController.getSinglePermission);
router.patch("/:id", auth_1.authMiddleware, (0, auth_1.requirePermission)("permission:update"), (0, validateRequest_1.default)(validation_permission_1.permissionValidation.updatePermissionSchema), controller_permission_1.permissionController.updatePermission);
router.delete("/:id", auth_1.authMiddleware, (0, auth_1.requirePermission)("permission:delete"), controller_permission_1.permissionController.deletePermission);
exports.PermissionRoutes = router;
//# sourceMappingURL=route.permission.js.map