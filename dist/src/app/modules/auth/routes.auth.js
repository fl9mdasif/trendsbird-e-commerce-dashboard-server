"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_auth_1 = require("./controller.auth");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_auth_1 = require("./validation.auth");
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.default)(validation_auth_1.authValidation.loginSchema), controller_auth_1.authController.loginUser);
router.post("/refresh", (0, validateRequest_1.default)(validation_auth_1.authValidation.refreshSchema), controller_auth_1.authController.refreshTokens);
router.post("/logout", auth_1.authMiddleware, controller_auth_1.authController.logoutUser);
router.get("/session", auth_1.authMiddleware, controller_auth_1.authController.getSessionUser);
exports.AuthRoutes = router;
exports.default = exports.AuthRoutes;
//# sourceMappingURL=routes.auth.js.map