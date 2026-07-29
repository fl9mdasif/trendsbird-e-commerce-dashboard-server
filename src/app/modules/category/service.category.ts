import { Category } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

async function wouldCreateCycle(categoryId: string, newParentId: string): Promise<boolean> {
  let current: string | null = newParentId;
  while (current) {
    if (current === categoryId) return true;
    const parentCategory: Category | null = await prisma.category.findUnique({ where: { id: current } });
    current = parentCategory?.parentId ?? null;
  }
  return false;
}

const createCategory = async (data: { name: string; parentId?: string | null }) => {
  if (data.parentId) {
    const parentExists = await prisma.category.findUnique({
      where: { id: data.parentId },
    });
    if (!parentExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Parent category not found");
    }
  }

  return await prisma.category.create({
    data,
  });
};

const getAllCategories = async (query: { tree?: string }) => {
  const result = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (query.tree === "true") {
    // Return structured tree
    const map: Record<string, Category & { children: any[] }> = {};
    const tree: any[] = [];

    result.forEach((cat: Category) => {
      map[cat.id] = { ...cat, children: [] };
    });

    result.forEach((cat: Category) => {
      if (cat.parentId && map[cat.parentId]) {
        map[cat.parentId].children.push(map[cat.id]);
      } else {
        tree.push(map[cat.id]);
      }
    });

    return tree;
  }

  return result;
};

const getSingleCategory = async (id: string) => {
  return await prisma.category.findUniqueOrThrow({
    where: { id },
    include: {
      parent: true,
      children: true,
    },
  });
};

const updateCategory = async (id: string, data: { name?: string; parentId?: string | null }) => {
  // Check if updating parent
  if (data.parentId) {
    if (data.parentId === id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "A category cannot be its own parent");
    }

    const parentExists = await prisma.category.findUnique({
      where: { id: data.parentId },
    });
    if (!parentExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Parent category not found");
    }

    const cycle = await wouldCreateCycle(id, data.parentId);
    if (cycle) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Category parent update would create a circular dependency cycle"
      );
    }
  }

  return await prisma.category.update({
    where: { id },
    data,
  });
};

const deleteCategory = async (id: string) => {
  // Prisma onDelete is set to Restrict, so this will throw if categories/products reference it.
  // We can add a custom count check to throw a cleaner error message.
  const childrenCount = await prisma.category.count({
    where: { parentId: id },
  });

  if (childrenCount > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Cannot delete category that has subcategories"
    );
  }

  const productCount = await prisma.productCategory.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Cannot delete category associated with products"
    );
  }

  return await prisma.category.delete({
    where: { id },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
