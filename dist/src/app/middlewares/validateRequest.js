"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateRequest = void 0;
const sendResponse_1 = require("../../shared/sendResponse");
const validateRequest = (schema) => {
    return (req, res, next) => {
        // If the schema expects a nested 'body', let's support both nested schemas (body: z.object({...})) and direct schemas.
        if ("shape" in schema && schema.shape.body) {
            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            if (!result.success) {
                const errors = result.error.issues.map((e) => `${e.path.filter((p) => p !== "body").join(".")}: ${e.message}`);
                return res.status(400).json((0, sendResponse_1.sendError)("Validation failed", 400, errors));
            }
            req.body = result.data.body;
        }
        else {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const errors = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
                return res.status(400).json((0, sendResponse_1.sendError)("Validation failed", 400, errors));
            }
            req.body = result.data;
        }
        next();
    };
};
exports.validateRequest = validateRequest;
exports.validate = exports.validateRequest;
exports.default = exports.validateRequest;
//# sourceMappingURL=validateRequest.js.map