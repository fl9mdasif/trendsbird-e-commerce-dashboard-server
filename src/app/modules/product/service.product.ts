import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createProduct = async (data: any) => {
  // Validate Category IDs existence
  const categoryCount = await prisma.category.count({
    where: { id: { in: data.categoryIds } },
  });
  if (categoryCount !== data.categoryIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "One or more category IDs are invalid");
  }

  // Validate Brand existence if provided
  if (data.brandId) {
    const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
    if (!brand) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Brand not found");
    }
  }

  // Validate Media files existence
  if (data.mediaIds && data.mediaIds.length > 0) {
    const mediaCount = await prisma.media.count({
      where: { id: { in: data.mediaIds } },
    });
    if (mediaCount !== data.mediaIds.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "One or more media IDs are invalid");
    }
  }

  // Rule checks
  if (!data.hasVariants) {
    // Simple Product Rules:
    // - MUST have price, stock, sku
    // - MUST NOT have variants
    if (data.price === undefined || data.price === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Simple product must have a price");
    }
    if (data.stock === undefined || data.stock === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Simple product must have stock");
    }
    if (data.stock < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Stock cannot be negative");
    }
    if (!data.sku) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Simple product must have a SKU");
    }
    if (data.salePrice && data.salePrice >= data.price) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Sale price must be less than price");
    }
    if (data.variants && data.variants.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Simple product cannot have variants");
    }
  } else {
    // Variable Product Rules:
    // - MUST have variants with own price/stock/sku
    // - MUST NOT have price/stock/sku on product
    if (data.price || data.salePrice || data.stock || data.sku) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Variable product must not have price, salePrice, stock, or sku at the product level"
      );
    }
    if (!data.variants || data.variants.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Variable product must have variants");
    }

    // Validate Variants
    const comboKeys = new Set<string>();
    for (const v of data.variants) {
      if (v.price === undefined || v.price === null) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Variant must have a price");
      }
      if (v.stock === undefined || v.stock === null) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Variant must have stock");
      }
      if (v.stock < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Variant stock cannot be negative");
      }
      if (!v.sku) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Variant must have a SKU");
      }
      if (v.salePrice && v.salePrice >= v.price) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Variant sale price must be less than price");
      }

      // Check duplicate variant combination:
      // const comboKey = attrs.map(a => `${a.attributeId}:${a.attributeValueId}`).sort().join('|');
      const key = v.attributes
        .map((a: any) => `${a.attributeId}:${a.attributeValueId}`)
        .sort()
        .join("|");
      if (comboKeys.has(key)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Duplicate variant combination detected: ${key}`
        );
      }
      comboKeys.add(key);
    }
  }

  // Execute entire product creation inside a transaction
  return await prisma.$transaction(async (tx: any) => {
    // 1. Create product
    const product = await tx.product.create({
      data: {
        name: data.name,
        description: data.description,
        hasVariants: data.hasVariants,
        price: data.hasVariants ? null : data.price,
        salePrice: data.hasVariants ? null : data.salePrice,
        stock: data.hasVariants ? null : data.stock,
        sku: data.hasVariants ? null : data.sku,
        brandId: data.brandId,
      },
    });

    // 2. Associate categories
    const categoryLinks = data.categoryIds.map((catId: string) => ({
      productId: product.id,
      categoryId: catId,
    }));
    await tx.productCategory.createMany({ data: categoryLinks });

    // 3. Associate media attachments
    if (data.mediaIds && data.mediaIds.length > 0) {
      const mediaLinks = data.mediaIds.map((mediaId: string) => ({
        productId: product.id,
        mediaId,
      }));
      await tx.mediaAttachment.createMany({ data: mediaLinks });
    }

    // 4. Create variants and variant attributes if variable product
    if (data.hasVariants) {
      for (const v of data.variants) {
        const variant = await tx.variant.create({
          data: {
            productId: product.id,
            price: v.price,
            salePrice: v.salePrice,
            stock: v.stock,
            sku: v.sku,
          },
        });

        const attributeLinks = v.attributes.map((attr: any) => ({
          variantId: variant.id,
          attributeId: attr.attributeId,
          attributeValueId: attr.attributeValueId,
        }));
        await tx.variantAttribute.createMany({ data: attributeLinks });
      }
    }

    return product;
  });
};

const getAllProducts = async (options: {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  brandId?: string;
  categoryId?: string;
}) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

  const andConditions: any[] = [];

  if (options.search) {
    andConditions.push({
      OR: [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ],
    });
  }

  if (options.brandId) {
    andConditions.push({ brandId: options.brandId });
  }

  if (options.categoryId) {
    andConditions.push({
      categories: {
        some: {
          categoryId: options.categoryId,
        },
      },
    });
  }

  const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      brand: true,
      categories: {
        include: {
          category: true,
        },
      },
      media: {
        include: {
          media: true,
        },
      },
      variants: {
        include: {
          attributes: {
            include: {
              attribute: true,
              attributeValue: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.product.count({
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

const getSingleProduct = async (id: string) => {
  return await prisma.product.findUniqueOrThrow({
    where: { id },
    include: {
      brand: true,
      categories: {
        include: {
          category: true,
        },
      },
      media: {
        include: {
          media: true,
        },
      },
      variants: {
        include: {
          attributes: {
            include: {
              attribute: true,
              attributeValue: true,
            },
          },
        },
      },
    },
  });
};

const deleteProduct = async (id: string) => {
  // Related dependencies in variant, variantAttribute, productCategory, mediaAttachment are deleted via cascade in Prisma.
  return await prisma.product.delete({
    where: { id },
  });
};

export const productService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
};
