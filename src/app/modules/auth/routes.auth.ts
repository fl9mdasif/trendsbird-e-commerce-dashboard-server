import express from "express";
import { authController } from "./controller.auth";
import { authMiddleware } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./validation.auth";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  authController.loginUser
);

router.post(
  "/refresh",
  validateRequest(authValidation.refreshSchema),
  authController.refreshTokens
);

router.post(
  "/logout",
  authMiddleware,
  authController.logoutUser
);

router.get(
  "/session",
  authMiddleware,
  authController.getSessionUser
);

export const AuthRoutes = router;
export default AuthRoutes;
