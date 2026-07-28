"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const service_permission_1 = require("./service.permission");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const createPermission = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_permission_1.permissionService.createPermission(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Permission created successfully",
        data: result,
    });
});
const getAllPermissions = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["search", "page", "limit", "sortBy", "sortOrder"]);
    const result = await service_permission_1.permissionService.getAllPermissions(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Permissions fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getSinglePermission = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_permission_1.permissionService.getSinglePermission(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Permission fetched successfully",
        data: result,
    });
});
const updatePermission = (0, catchAsync_1.default)(async (req, res) => {
    const result = await service_permission_1.permissionService.updatePermission(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Permission updated successfully",
        data: result,
    });
});
const deletePermission = (0, catchAsync_1.default)(async (req, res) => {
    await service_permission_1.permissionService.deletePermission(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Permission deleted successfully",
        data: null,
    });
});
exports.permissionController = {
    createPermission,
    getAllPermissions,
    getSinglePermission,
    updatePermission,
    deletePermission,
};
//# sourceMappingURL=controller.permission.js.map