import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../helpers/jwtHelpers";
import prisma from "../../shared/prisma";
import { sendError } from "../../shared/sendResponse";

export const authMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json(sendError("Token required", 401));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json(sendError("Token required", 401));
  }

  try {
    const payload = verifyAccessToken(token);
    
    // Fetch user and include permissions
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.active) {
      return res.status(401).json(sendError("Unauthorized", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(sendError("Invalid or expired token", 401));
  }
};

export const requirePermission = (permission: string) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json(sendError("Insufficient permissions", 403));
    }

    const permissions: string[] = req.user.role.permissions.map(
      (rp: any) => rp.permission.name
    );

    // Check direct match
    if (permissions.includes(permission)) {
      return next();
    }

    // Check wildcard match, e.g. permission is 'product:create' and user has 'product:*'
    const parts = permission.split(":");
    if (parts.length === 2) {
      const moduleName = parts[0];
      if (permissions.includes(`${moduleName}:*`)) {
        return next();
      }
    }

    // Check global wildcard '*'
    if (permissions.includes("*")) {
      return next();
    }

    return res.status(403).json(sendError("Insufficient permissions", 403));
  };
};

// Default export to support previous pattern if needed
export default authMiddleware;
