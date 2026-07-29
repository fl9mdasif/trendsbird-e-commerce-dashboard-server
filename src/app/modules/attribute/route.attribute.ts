import express from "express";
import { attributeController } from "./controller.attribute";
import { authMiddleware, requirePermission } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { attributeValidation } from "./validation.attribute";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("attribute:create"),
  validateRequest(attributeValidation.createAttributeSchema),
  attributeController.createAttribute
);

router.get(
  "/",
  authMiddleware,
  requirePermission("attribute:read"),
  attributeController.getAllAttributes
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("attribute:read"),
  attributeController.getSingleAttribute
);

router.patch(
  "/:id",
  authMiddleware,
  requirePermission("attribute:update"),
  validateRequest(attributeValidation.updateAttributeSchema),
  attributeController.updateAttribute
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("attribute:delete"),
  attributeController.deleteAttribute
);

// Nested Route for Values
router.post(
  "/:id/values",
  authMiddleware,
  requirePermission("attribute:update"),
  validateRequest(attributeValidation.createAttributeValueSchema),
  attributeController.createAttributeValue
);

router.patch(
  "/:id/values/:vid",
  authMiddleware,
  requirePermission("attribute:update"),
  validateRequest(attributeValidation.updateAttributeValueSchema),
  attributeController.updateAttributeValue
);

router.delete(
  "/:id/values/:vid",
  authMiddleware,
  requirePermission("attribute:update"),
  attributeController.deleteAttributeValue
);

export const AttributeRoutes = router;
