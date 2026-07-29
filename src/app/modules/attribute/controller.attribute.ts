import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { attributeService } from "./service.attribute";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.createAttribute(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Attribute created successfully",
    data: result,
  });
});

const getAllAttributes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["search", "page", "limit", "sortBy", "sortOrder"]);
  const result = await attributeService.getAllAttributes(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attributes fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.getSingleAttribute(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attribute fetched successfully",
    data: result,
  });
});

const updateAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.updateAttribute(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attribute updated successfully",
    data: result,
  });
});

const deleteAttribute = catchAsync(async (req: Request, res: Response) => {
  await attributeService.deleteAttribute(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attribute deleted successfully",
    data: null,
  });
});

// Nested Attribute Values
const createAttributeValue = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.createAttributeValue(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Attribute value added successfully",
    data: result,
  });
});

const updateAttributeValue = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.updateAttributeValue(
    req.params.id as string,
    req.params.vid as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attribute value updated successfully",
    data: result,
  });
});

const deleteAttributeValue = catchAsync(async (req: Request, res: Response) => {
  await attributeService.deleteAttributeValue(req.params.id as string, req.params.vid as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attribute value deleted successfully",
    data: null,
  });
});

export const attributeController = {
  createAttribute,
  getAllAttributes,
  getSingleAttribute,
  updateAttribute,
  deleteAttribute,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
};
