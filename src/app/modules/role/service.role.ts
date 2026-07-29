import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createRole = async (data: { name: string; description?: string }) => {
  return await prisma.role.create({
    data,
  });
};

const getAllRoles = async (options: {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

  const whereCondition = options.search
    ? {
        OR: [
          { name: { contains: options.search, mode: "insensitive" as const } },
          { description: { contains: options.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const result = await prisma.role.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  const total = await prisma.role.count({
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

const getSingleRole = async (id: string) => {
  return await prisma.role.findUniqueOrThrow({
    where: { id },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};

const updateRole = async (id: string, data: { name?: string; description?: string }) => {
  return await prisma.role.update({
    where: { id },
    data,
  });
};

const deleteRole = async (roleId: string) => {
  const userCount = await prisma.user.count({ where: { roleId } });
  if (userCount > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `${userCount} users hold this role`
    );
  }

  return await prisma.role.delete({
    where: { id: roleId },
  });
};

const assignPermission = async (roleId: string, permissionId: string) => {
  // Check if role and permission exist
  await prisma.role.findUniqueOrThrow({ where: { id: roleId } });
  await prisma.permission.findUniqueOrThrow({ where: { id: permissionId } });

  return await prisma.rolePermission.create({
    data: {
      roleId,
      permissionId,
    },
    include: {
      role: true,
      permission: true,
    },
  });
};

const removePermission = async (roleId: string, permissionId: string) => {
  const rp = await prisma.rolePermission.findUnique({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
    include: {
      permission: true,
    },
  });

  if (!rp) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role permission mapping not found");
  }

  if (rp.permission.name === "role:update") {
    const count = await prisma.rolePermission.count({
      where: { permissionId },
    });
    if (count <= 1) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Cannot remove role:update from the only role that has it"
      );
    }
  }

  return await prisma.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
  });
};

export const roleService = {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission,
};
