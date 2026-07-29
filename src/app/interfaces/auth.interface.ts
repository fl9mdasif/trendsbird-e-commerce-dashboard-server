import { Request } from "express";
import { User, Role, Permission, RolePermission } from "@prisma/client";

export type RolePermissionWithPermission = RolePermission & {
  permission: Permission;
};

export type RoleWithPermissions = Role & {
  permissions: RolePermissionWithPermission[];
};

export type UserWithRole = User & {
  role: RoleWithPermissions;
};

export interface AuthenticatedRequest extends Request {
  user?: UserWithRole;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
