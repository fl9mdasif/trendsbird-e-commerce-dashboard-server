"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const loginUser = async (payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: payload.email },
        include: {
            role: true,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    if (!user.active) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User is inactive");
    }
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    // Generate tokens
    const accessToken = (0, jwtHelpers_1.generateAccessToken)({ sub: user.id, email: user.email });
    const refreshToken = (0, jwtHelpers_1.generateRefreshToken)({ sub: user.id, email: user.email });
    // Store hashed refresh token in database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, config_1.default.jwt.bcrypt_rounds);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
    });
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name,
        },
    };
};
const refreshTokens = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token required");
    }
    // Clean token in case user included 'Bearer ' prefix or extra quotes
    let cleanToken = refreshToken.trim();
    if (cleanToken.startsWith("Bearer ")) {
        cleanToken = cleanToken.slice(7).trim();
    }
    let decodedPayload;
    try {
        decodedPayload = (0, jwtHelpers_1.verifyRefreshToken)(cleanToken);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: decodedPayload.sub },
        include: {
            role: true,
        },
    });
    if (!user || !user.active) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    if (!user.refreshToken) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    // Verify stored refresh token hash
    const isMatched = await bcrypt.compare(cleanToken, user.refreshToken);
    if (!isMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token");
    }
    // Rotate tokens
    const newAccessToken = (0, jwtHelpers_1.generateAccessToken)({ sub: user.id, email: user.email });
    const newRefreshToken = (0, jwtHelpers_1.generateRefreshToken)({ sub: user.id, email: user.email });
    // Update stored refresh token
    const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, config_1.default.jwt.bcrypt_rounds);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: { refreshToken: newHashedRefreshToken },
    });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};
const logoutUser = async (userId) => {
    await prisma_1.default.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};
exports.authService = {
    loginUser,
    refreshTokens,
    logoutUser,
};
//# sourceMappingURL=service.auth.js.map