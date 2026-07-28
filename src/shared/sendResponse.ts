import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T | null | undefined;
  }
) => {
  res.status(jsonData.statusCode).json({
    success: jsonData.success,
    statusCode: jsonData.statusCode,
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
  });
};

export const sendSuccess = (data: unknown, meta?: object) => ({
  success: true,
  data,
  ...(meta && { meta }),
});

export const sendError = (message: string, statusCode = 400, errors?: string[]) => ({
  success: false,
  statusCode,
  message,
  ...(errors && { errors }),
});

export default sendResponse;
