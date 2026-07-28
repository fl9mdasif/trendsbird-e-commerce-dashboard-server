import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../helpers/jwtHelpers";

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.active) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is inactive");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate tokens
  const accessToken = generateAccessToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ sub: user.id, email: user.email });

  // Store hashed refresh token in database
  const hashedRefreshToken = await bcrypt.hash(refreshToken, config.jwt.bcrypt_rounds);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  };
};

const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token required");
  }

  // Clean token in case user included 'Bearer ' prefix or extra quotes
  let cleanToken = refreshToken.trim();
  if (cleanToken.startsWith("Bearer ")) {
    cleanToken = cleanToken.slice(7).trim();
  }

  let decodedPayload;
  try {
    decodedPayload = verifyRefreshToken(cleanToken);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decodedPayload.sub },
    include: {
      role: true,
    },
  });

  if (!user || !user.active) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  if (!user.refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  // Verify stored refresh token hash
  const isMatched = await bcrypt.compare(cleanToken, user.refreshToken);
  if (!isMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
  }

  // Rotate tokens
  const newAccessToken = generateAccessToken({ sub: user.id, email: user.email });
  const newRefreshToken = generateRefreshToken({ sub: user.id, email: user.email });

  // Update stored refresh token
  const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, config.jwt.bcrypt_rounds);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newHashedRefreshToken },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

export const authService = {
  loginUser,
  refreshTokens,
  logoutUser,
};
