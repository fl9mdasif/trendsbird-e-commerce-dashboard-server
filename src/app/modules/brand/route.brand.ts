import express from "express";
import { brandController } from "./controller.brand";
import { authMiddleware, requirePermission } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { brandValidation } from "./validation.brand";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("brand:create"),
  validateRequest(brandValidation.createBrandSchema),
  brandController.createBrand
);

router.get(
  "/",
  authMiddleware,
  requirePermission("brand:read"),
  brandController.getAllBrands
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("brand:read"),
  brandController.getSingleBrand
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission("brand:update"),
  validateRequest(brandValidation.updateBrandSchema),
  brandController.updateBrand
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("brand:delete"),
  brandController.deleteBrand
);

export const BrandRoutes = router;
