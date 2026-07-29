import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createBrand = async (data: { name: string }) => {
  return await prisma.brand.create({
    data,
  });
};

const getAllBrands = async (options: {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

  const whereCondition = options.search
    ? {
        name: { contains: options.search, mode: "insensitive" as const },
      }
    : {};

  const result = await prisma.brand.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.brand.count({
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

const getSingleBrand = async (id: string) => {
  return await prisma.brand.findUniqueOrThrow({
    where: { id },
  });
};

const updateBrand = async (id: string, data: { name?: string }) => {
  return await prisma.brand.update({
    where: { id },
    data,
  });
};

const deleteBrand = async (brandId: string) => {
  // Brand delete — refuse if products reference it
  const productCount = await prisma.product.count({
    where: { brandId },
  });

  if (productCount > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Cannot delete brand with products"
    );
  }

  return await prisma.brand.delete({
    where: { id: brandId },
  });
};

export const brandService = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
