import { NextFunction, Request, Response } from "express";
export declare const authMiddleware: (req: Request & {
    user?: any;
}, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requirePermission: (permission: string) => (req: Request & {
    user?: any;
}, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export default authMiddleware;
