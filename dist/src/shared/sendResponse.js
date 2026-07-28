"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendResponse = (res, jsonData) => {
    res.status(jsonData.statusCode).json({
        success: jsonData.success,
        statusCode: jsonData.statusCode,
        message: jsonData.message,
        meta: jsonData.meta || null || undefined,
        data: jsonData.data || null || undefined,
    });
};
const sendSuccess = (data, meta) => ({
    success: true,
    data,
    ...(meta && { meta }),
});
exports.sendSuccess = sendSuccess;
const sendError = (message, statusCode = 400, errors) => ({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
});
exports.sendError = sendError;
exports.default = sendResponse;
//# sourceMappingURL=sendResponse.js.map