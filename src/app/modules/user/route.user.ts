import express from "express";
import { userController } from "./controller.user";
import { authMiddleware, requirePermission } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./validation.user";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("user:create"),
  validateRequest(userValidation.createUserSchema),
  userController.createUser
);

router.get(
  "/",
  authMiddleware,
  requirePermission("user:read"),
  userController.getAllUsers
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("user:read"),
  userController.getSingleUser
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission("user:update"),
  validateRequest(userValidation.updateUserSchema),
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("user:delete"),
  userController.deleteUser
);

export const UserRoutes = router;
