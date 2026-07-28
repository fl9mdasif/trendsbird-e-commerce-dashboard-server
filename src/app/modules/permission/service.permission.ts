import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createPermission = async (data: { name: string; description?: string }) => {
  return await prisma.permission.create({
    data,
  });
};

const getAllPermissions = async (options: {
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

  const result = await prisma.permission.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.permission.count({
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

const getSinglePermission = async (id: string) => {
  return await prisma.permission.findUniqueOrThrow({
    where: { id },
  });
};

const updatePermission = async (id: string, data: { name?: string; description?: string }) => {
  return await prisma.permission.update({
    where: { id },
    data,
  });
};

const deletePermission = async (id: string) => {
  return await prisma.permission.delete({
    where: { id },
  });
};

export const permissionService = {
  createPermission,
  getAllPermissions,
  getSinglePermission,
  updatePermission,
  deletePermission,
};
