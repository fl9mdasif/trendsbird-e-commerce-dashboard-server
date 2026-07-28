import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authService } from "./service.auth";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshTokens(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tokens refreshed successfully",
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  await authService.logoutUser(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const getSessionUser = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  // Exclude password and refreshToken
  const { password, refreshToken, ...safeUser } = req.user;
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User session fetched successfully",
    data: safeUser,
  });
});

export const authController = {
  loginUser,
  refreshTokens,
  logoutUser,
  getSessionUser,
};
