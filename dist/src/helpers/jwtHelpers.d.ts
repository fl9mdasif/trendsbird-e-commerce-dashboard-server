import jwt from "jsonwebtoken";
export declare const generateAccessToken: (payload: {
    sub: string;
    email: string;
}) => string;
export declare const generateRefreshToken: (payload: {
    sub: string;
    email: string;
}) => string;
export declare const verifyAccessToken: (token: string) => jwt.JwtPayload;
export declare const verifyRefreshToken: (token: string) => jwt.JwtPayload;
export declare const jwtHelpers: {
    generateAccessToken: (payload: {
        sub: string;
        email: string;
    }) => string;
    generateRefreshToken: (payload: {
        sub: string;
        email: string;
    }) => string;
    verifyAccessToken: (token: string) => jwt.JwtPayload;
    verifyRefreshToken: (token: string) => jwt.JwtPayload;
};
export default jwtHelpers;
