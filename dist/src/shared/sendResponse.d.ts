import { Response } from "express";
declare const sendResponse: <T>(res: Response, jsonData: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data: T | null | undefined;
}) => void;
export declare const sendSuccess: (data: unknown, meta?: object) => {
    meta?: object | undefined;
    success: boolean;
    data: unknown;
};
export declare const sendError: (message: string, statusCode?: number, errors?: string[]) => {
    errors?: string[] | undefined;
    success: boolean;
    statusCode: number;
    message: string;
};
export default sendResponse;
