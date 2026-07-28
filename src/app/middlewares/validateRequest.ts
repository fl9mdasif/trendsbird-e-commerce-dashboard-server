import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sendError } from "../../shared/sendResponse";

export const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // If the schema expects a nested 'body', let's support both nested schemas (body: z.object({...})) and direct schemas.
    if ("shape" in schema && (schema as any).shape.body) {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        const errors = result.error.issues.map(
          (e) => `${e.path.filter((p) => p !== "body").join(".")}: ${e.message}`
        );
        return res.status(400).json(sendError("Validation failed", 400, errors));
      }
      req.body = (result.data as any).body;
    } else {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.issues.map(
          (e) => `${e.path.join(".")}: ${e.message}`
        );
        return res.status(400).json(sendError("Validation failed", 400, errors));
      }
      req.body = result.data;
    }

    next();
  };
};

export const validate = validateRequest;
export default validateRequest;
