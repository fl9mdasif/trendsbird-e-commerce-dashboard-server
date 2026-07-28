"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createPermission = async (data) => {
    return await prisma_1.default.permission.create({
        data,
    });
};
const getAllPermissions = async (options) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const whereCondition = options.search
        ? {
            OR: [
                { name: { contains: options.search, mode: "insensitive" } },
                { description: { contains: options.search, mode: "insensitive" } },
            ],
        }
        : {};
    const result = await prisma_1.default.permission.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = await prisma_1.default.permission.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getSinglePermission = async (id) => {
    return await prisma_1.default.permission.findUniqueOrThrow({
        where: { id },
    });
};
const updatePermission = async (id, data) => {
    return await prisma_1.default.permission.update({
        where: { id },
        data,
    });
};
const deletePermission = async (id) => {
    return await prisma_1.default.permission.delete({
        where: { id },
    });
};
exports.permissionService = {
    createPermission,
    getAllPermissions,
    getSinglePermission,
    updatePermission,
    deletePermission,
};
//# sourceMappingURL=service.permission.js.map