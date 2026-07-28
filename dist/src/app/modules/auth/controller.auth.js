"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const service_auth_1 = require("./service.auth");
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_auth_1.authService.loginUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged in successfully",
        data: result,
    });
});
const refreshTokens = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await service_auth_1.authService.refreshTokens(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Tokens refreshed successfully",
        data: result,
    });
});
const logoutUser = (0, catchAsync_1.default)(async (req, res) => {
    await service_auth_1.authService.logoutUser(req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});
const getSessionUser = (0, catchAsync_1.default)(async (req, res) => {
    // Exclude password and refreshToken
    const { password, refreshToken, ...safeUser } = req.user;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User session fetched successfully",
        data: safeUser,
    });
});
exports.authController = {
    loginUser,
    refreshTokens,
    logoutUser,
    getSessionUser,
};
//# sourceMappingURL=controller.auth.js.map