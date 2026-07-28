import express from "express";
import { permissionController } from "./controller.permission";
import { authMiddleware, requirePermission } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { permissionValidation } from "./validation.permission";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("permission:create"),
  validateRequest(permissionValidation.createPermissionSchema),
  permissionController.createPermission
);

router.get(
  "/",
  authMiddleware,
  requirePermission("permission:read"),
  permissionController.getAllPermissions
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("permission:read"),
  permissionController.getSinglePermission
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission("permission:update"),
  validateRequest(permissionValidation.updatePermissionSchema),
  permissionController.updatePermission
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("permission:delete"),
  permissionController.deletePermission
);

export const PermissionRoutes = router;
