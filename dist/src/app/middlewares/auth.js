"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.authMiddleware = void 0;
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const sendResponse_1 = require("../../shared/sendResponse");
const authMiddleware = async (req, res, next) => {
    const rawHeader = req.headers.authorization;
    if (!rawHeader) {
        return res.status(401).json((0, sendResponse_1.sendError)("Token required", 401));
    }
    // Handle array or comma-separated headers cleanly
    const authHeader = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    const singleHeader = authHeader.includes(",") ? authHeader.split(",")[0] : authHeader;
    let token = singleHeader.trim();
    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }
    if (!token) {
        return res.status(401).json((0, sendResponse_1.sendError)("Token required", 401));
    }
    try {
        const payload = (0, jwtHelpers_1.verifyAccessToken)(token);
        // Fetch user and include permissions
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.sub },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user || !user.active) {
            return res.status(401).json((0, sendResponse_1.sendError)("Unauthorized", 401));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json((0, sendResponse_1.sendError)("Invalid or expired token", 401));
    }
};
exports.authMiddleware = authMiddleware;
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json((0, sendResponse_1.sendError)("Insufficient permissions", 403));
        }
        const permissions = req.user.role.permissions.map((rp) => rp.permission.name);
        // Check direct match
        if (permissions.includes(permission)) {
            return next();
        }
        // Check wildcard match, e.g. permission is 'product:create' and user has 'product:*'
        const parts = permission.split(":");
        if (parts.length === 2) {
            const moduleName = parts[0];
            if (permissions.includes(`${moduleName}:*`)) {
                return next();
            }
        }
        // Check global wildcard '*'
        if (permissions.includes("*")) {
            return next();
        }
        return res.status(403).json((0, sendResponse_1.sendError)("Insufficient permissions", 403));
    };
};
exports.requirePermission = requirePermission;
exports.default = exports.authMiddleware;
//# sourceMappingURL=auth.js.map