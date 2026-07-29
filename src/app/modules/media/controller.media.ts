import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { mediaService } from "./service.media";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import pick from "../../../shared/pick";

const uploadMedia = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload a file");
  }

  const result = await mediaService.uploadMedia(req.file);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "File uploaded successfully",
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
  deleteMedia,
  getAllMedia,
};
