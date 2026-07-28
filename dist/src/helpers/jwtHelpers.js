"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const generateAccessToken = (payload) => {
    const options = {
        expiresIn: config_1.default.jwt.access_expires_in,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.access_secret, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: config_1.default.jwt.refresh_expires_in,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.refresh_secret, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.default.jwt.access_secret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.default.jwt.refresh_secret);
};
exports.verifyRefreshToken = verifyRefreshToken;
exports.jwtHelpers = {
    generateAccessToken: exports.generateAccessToken,
    generateRefreshToken: exports.generateRefreshToken,
    verifyAccessToken: exports.verifyAccessToken,
    verifyRefreshToken: exports.verifyRefreshToken,
};
exports.default = exports.jwtHelpers;
//# sourceMappingURL=jwtHelpers.js.map