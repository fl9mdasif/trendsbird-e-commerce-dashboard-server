import express from "express";
import multer from "multer";
import { mediaController } from "./controller.media";
import { authMiddleware, requirePermission } from "../../middlewares/auth";

const router = express.Router();

// MUST use memoryStorage because Vercel is serverless with no persistent disk
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  authMiddleware,
  requirePermission("media:create"),
  upload.single("file"),
  mediaController.uploadMedia
);

router.get(
  "/",
  authMiddleware,
  requirePermission("media:read"),
  mediaController.getAllMedia
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("media:delete"),
  mediaController.deleteMedia
);

export const MediaRoutes = router;
