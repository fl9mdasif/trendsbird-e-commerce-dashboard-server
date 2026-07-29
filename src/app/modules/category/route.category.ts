import express from "express";
import { categoryController } from "./controller.category";
import { authMiddleware, requirePermission } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./validation.category";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("category:create"),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory
);

router.get(
  "/",
  authMiddleware,
  requirePermission("category:read"),
  categoryController.getAllCategories
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("category:read"),
  categoryController.getSingleCategory
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission("category:update"),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("category:delete"),
  categoryController.deleteCategory
);

export const CategoryRoutes = router;
