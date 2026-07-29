import express from "express";
import { productController } from "./controller.product";
import { authMiddleware, requirePermission } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { productValidation } from "./validation.product";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("product:create"),
  validateRequest(productValidation.createProductSchema),
  productController.createProduct
);

router.get(
  "/",
  authMiddleware,
  requirePermission("product:read"),
  productController.getAllProducts
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("product:read"),
  productController.getSingleProduct
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("product:delete"),
  productController.deleteProduct
);

export const ProductRoutes = router;
