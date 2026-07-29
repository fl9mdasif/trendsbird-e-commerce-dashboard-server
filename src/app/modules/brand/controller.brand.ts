import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { brandService } from "./service.brand";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.createBrand(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Brand created successfully",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["search", "page", "limit", "sortBy", "sortOrder"]);
  const result = await brandService.getAllBrands(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brands fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.getSingleBrand(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand fetched successfully",
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.updateBrand(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  await brandService.deleteBrand(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand deleted successfully",
    data: null,
  });
});

export const brandController = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
