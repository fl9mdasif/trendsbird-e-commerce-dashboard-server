import express from "express";
import { roleController } from "./controller.role";
import { authMiddleware, requirePermission } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { roleValidation } from "./validation.role";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("role:create"),
  validateRequest(roleValidation.createRoleSchema),
  roleController.createRole
);

router.get(
  "/",
  authMiddleware,
  requirePermission("role:read"),
  roleController.getAllRoles
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("role:read"),
  roleController.getSingleRole
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission("role:update"),
  validateRequest(roleValidation.updateRoleSchema),
  roleController.updateRole
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("role:delete"),
  roleController.deleteRole
);

router.post(
  "/:id/permissions",
  authMiddleware,
  requirePermission("role:update"),
  validateRequest(roleValidation.assignPermissionSchema),
  roleController.assignPermission
);

router.delete(
  "/:id/permissions/:pid",
  authMiddleware,
  requirePermission("role:update"),
  roleController.removePermission
);

export const RoleRoutes = router;
