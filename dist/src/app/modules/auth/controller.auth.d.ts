import { Request, Response } from "express";
export declare const authController: {
    loginUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    refreshTokens: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    logoutUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getSessionUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
