import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { mediaService } from "./service.media";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import pick from "../../../shared/pick";

const uploadMedia = catchAsync(async (req: Request, res: Response) => {
  const file = req.file || (req.files && Array.isArray(req.files) ? req.files[0] : null);
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload a file");
  }

  const result = await mediaService.uploadMedia(file);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

const uploadMultipleMedia = catchAsync(async (req: Request, res: Response) => {
  let files: Express.Multer.File[] = [];
  if (req.files && Array.isArray(req.files)) {
    files = req.files as Express.Multer.File[];
  } else if (req.file) {
    files = [req.file];
  }

  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload at least one file");
  }

  const result = await mediaService.uploadMultipleMedia(files);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Files uploaded successfully",
    data: result,
  });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
  await mediaService.deleteMedia(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media deleted successfully",
    data: null,
  });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await mediaService.getAllMedia(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Media files fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const mediaController = {
  uploadMedia,
  uploadMultipleMedia,
  deleteMedia,
  getAllMedia,
};
