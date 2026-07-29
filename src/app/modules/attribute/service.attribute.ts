import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createAttribute = async (data: { name: string }) => {
  return await prisma.attribute.create({
    data,
  });
};

const getAllAttributes = async (options: {
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

  const result = await prisma.attribute.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      values: true,
    },
  });

  const total = await prisma.attribute.count({
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

const getSingleAttribute = async (id: string) => {
  return await prisma.attribute.findUniqueOrThrow({
    where: { id },
    include: {
      values: true,
    },
  });
};

const updateAttribute = async (id: string, data: { name?: string }) => {
  return await prisma.attribute.update({
    where: { id },
    data,
  });
};

const deleteAttribute = async (id: string) => {
  return await prisma.attribute.delete({
    where: { id },
  });
};

// Nested Attribute Values
const createAttributeValue = async (attributeId: string, data: { value: string }) => {
  // Confirm attribute exists
  await prisma.attribute.findUniqueOrThrow({ where: { id: attributeId } });

  return await prisma.attributeValue.create({
    data: {
      attributeId,
      value: data.value,
    },
  });
};

const updateAttributeValue = async (attributeId: string, valueId: string, data: { value: string }) => {
  // Check if mapping exists
  const exists = await prisma.attributeValue.findFirst({
    where: { id: valueId, attributeId },
  });

  if (!exists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attribute value not found for this attribute");
  }

  return await prisma.attributeValue.update({
    where: { id: valueId },
    data: { value: data.value },
  });
};

const deleteAttributeValue = async (attributeId: string, valueId: string) => {
  const exists = await prisma.attributeValue.findFirst({
    where: { id: valueId, attributeId },
  });

  if (!exists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attribute value not found for this attribute");
  }

  return await prisma.attributeValue.delete({
    where: { id: valueId },
  });
};

export const attributeService = {
  createAttribute,
  getAllAttributes,
  getSingleAttribute,
  updateAttribute,
  deleteAttribute,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
};
