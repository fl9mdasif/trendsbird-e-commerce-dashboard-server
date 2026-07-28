import { Request, Response } from "express";
export declare const permissionController: {
    createPermission: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllPermissions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getSinglePermission: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updatePermission: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deletePermission: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
