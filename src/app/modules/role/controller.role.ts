import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { roleService } from "./service.role";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createRole = catchAsync(async (req: Request, res: Response) => {
  const result = await roleService.createRole(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Role created successfully",
    data: result,
  });
});

const getAllRoles = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["search", "page", "limit", "sortBy", "sortOrder"]);
  const result = await roleService.getAllRoles(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Roles fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleRole = catchAsync(async (req: Request, res: Response) => {
  const result = await roleService.getSingleRole(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role fetched successfully",
    data: result,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const result = await roleService.updateRole(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role updated successfully",
    data: result,
  });
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
  await roleService.deleteRole(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role deleted successfully",
    data: null,
  });
});

const assignPermission = catchAsync(async (req: Request, res: Response) => {
  const result = await roleService.assignPermission(req.params.id as string, req.body.permissionId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Permission assigned to role successfully",
    data: result,
  });
});

const removePermission = catchAsync(async (req: Request, res: Response) => {
  await roleService.removePermission(req.params.id as string, req.params.pid as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission removed from role successfully",
    data: null,
  });
});

export const roleController = {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission,
};
