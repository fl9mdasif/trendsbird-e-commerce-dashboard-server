import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { permissionService } from "./service.permission";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createPermission = catchAsync(async (req: Request, res: Response) => {
  const result = await permissionService.createPermission(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Permission created successfully",
    data: result,
  });
});

const getAllPermissions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["search", "page", "limit", "sortBy", "sortOrder"]);
  const result = await permissionService.getAllPermissions(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await permissionService.getSinglePermission(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission fetched successfully",
    data: result,
  });
});

const updatePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await permissionService.updatePermission(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission updated successfully",
    data: result,
  });
});

const deletePermission = catchAsync(async (req: Request, res: Response) => {
  await permissionService.deletePermission(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission deleted successfully",
    data: null,
  });
});

export const permissionController = {
  createPermission,
  getAllPermissions,
  getSinglePermission,
  updatePermission,
  deletePermission,
};
