import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createUser = async (data: any) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, config.jwt.bcrypt_rounds);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      active: true,
      roleId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getAllUsers = async (options: {
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
          { email: { contains: options.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      email: true,
      name: true,
      active: true,
      roleId: true,
      role: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
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

const getSingleUser = async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      active: true,
      roleId: true,
      role: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUser = async (requestingUserId: string, targetUserId: string, data: any) => {
  // Check user self-escalation guard
  if (requestingUserId === targetUserId && data.roleId !== undefined) {
    throw new ApiError(httpStatus.FORBIDDEN, "Cannot change your own role");
  }

  // Hash password if updating it
  if (data.password) {
    data.password = await bcrypt.hash(data.password, config.jwt.bcrypt_rounds);
  }

  return await prisma.user.update({
    where: { id: targetUserId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      active: true,
      roleId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};

export const userService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
