import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

export const generateAccessToken = (payload: { sub: string; email: string }) => {
  return jwt.sign(payload, config.jwt.access_secret as Secret, {
    expiresIn: config.jwt.access_expires_in,
  });
};

export const generateRefreshToken = (payload: { sub: string; email: string }) => {
  return jwt.sign(payload, config.jwt.refresh_secret as Secret, {
    expiresIn: config.jwt.refresh_expires_in,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwt.access_secret as Secret) as jwt.JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwt.refresh_secret as Secret) as jwt.JwtPayload;
};

export const jwtHelpers = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
export default jwtHelpers;
