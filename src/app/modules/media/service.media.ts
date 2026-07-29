import sharp from "sharp";
import { supabase } from "../../../config/supabase";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";

const uploadMedia = async (file: Express.Multer.File) => {
  // Validate Mime Type
  if (!config.file.allowed_mime_types.includes(file.mimetype)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "File type not allowed");
  }

  // Validate File Size (config is in MB, Multer size is in bytes)
  const maxSizeBytes = config.file.max_size_mb * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `File size exceeds maximum limit of ${config.file.max_size_mb}MB`
    );
  }

  const isImage = file.mimetype.startsWith("image/");
  const fileExt = file.originalname.split(".").pop() || "";
  const baseName = file.originalname.split(".").shift()?.replace(/[^a-zA-Z0-9]/g, "") || "file";
  const uniqueId = Date.now() + "-" + Math.round(Math.random() * 1e9);

  let mainBuffer = file.buffer;
  let thumbBuffer: Buffer | null = null;

  let mainFilename = `${uniqueId}-${baseName}.${fileExt}`;
  let thumbFilename = `thumb-${uniqueId}-${baseName}.${fileExt}`;
  let mimeType = file.mimetype;

  // Image resizing and thumbnail using Sharp
  if (isImage) {
    try {
      // 1. Resize main image (max 1200px width/height, keep ratio)
      mainBuffer = await sharp(file.buffer)
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .toFormat("webp")
        .toBuffer();
      
      mainFilename = `${uniqueId}-${baseName}.webp`;
      mimeType = "image/webp";

      // 2. Generate thumbnail (200x200 cover)
      thumbBuffer = await sharp(file.buffer)
        .resize({ width: 200, height: 200, fit: "cover" })
        .toFormat("webp")
        .toBuffer();
      
      thumbFilename = `thumb-${uniqueId}-${baseName}.webp`;
    } catch (err) {
      // Fallback to original buffer on error
      mainBuffer = file.buffer;
    }
  }

  // 3. Upload both to Supabase Storage
  const { data: mainData, error: mainError } = await supabase.storage
    .from(config.supabase.bucket)
    .upload(mainFilename, mainBuffer, {
      contentType: mimeType,
      cacheControl: "3600",
      upsert: true,
    });

  if (mainError) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Supabase upload error: ${mainError.message}`
    );
  }

  // Get public URLs
  const { data: mainUrlData } = supabase.storage
    .from(config.supabase.bucket)
    .getPublicUrl(mainFilename);

  const mainUrl = mainUrlData.publicUrl;
  let thumbUrl: string | null = null;

  if (thumbBuffer) {
    const { data: thumbData, error: thumbError } = await supabase.storage
      .from(config.supabase.bucket)
      .upload(thumbFilename, thumbBuffer, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: true,
      });

    if (!thumbError) {
      const { data: thumbUrlData } = supabase.storage
        .from(config.supabase.bucket)
        .getPublicUrl(thumbFilename);
      thumbUrl = thumbUrlData.publicUrl;
    }
  }

  // 4. Save to PostgreSQL database
  return await prisma.media.create({
    data: {
      name: file.originalname,
      url: mainUrl,
      thumbnailUrl: thumbUrl,
      mimeType,
      sizeBytes: mainBuffer.length,
    },
  });
};

const deleteMedia = async (mediaId: string) => {
  // Guard check: refuse if attached to products
  const attachments = await prisma.mediaAttachment.count({
    where: { mediaId },
  });

  if (attachments > 0) {
    throw new ApiError(httpStatus.CONFLICT, "Media is attached to products");
  }

  const media = await prisma.media.findUniqueOrThrow({
    where: { id: mediaId },
  });

  // Helper to extract bucket path
  const getPathFromUrl = (url: string) => {
    const bucketSegment = `/${config.supabase.bucket}/`;
    if (url.includes(bucketSegment)) {
      return url.split(bucketSegment).pop();
    }
    return null;
  };

  const mainPath = getPathFromUrl(media.url);
  if (mainPath) {
    await supabase.storage.from(config.supabase.bucket).remove([mainPath]);
  }

  if (media.thumbnailUrl) {
    const thumbPath = getPathFromUrl(media.thumbnailUrl);
    if (thumbPath) {
      await supabase.storage.from(config.supabase.bucket).remove([thumbPath]);
    }
  }

  return await prisma.media.delete({
    where: { id: mediaId },
  });
};

const getAllMedia = async (options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

  const result = await prisma.media.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.media.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const mediaService = {
  uploadMedia,
  deleteMedia,
  getAllMedia,
};
