import { NextFunction, Request, Response } from "express";
import { sendError } from "../../shared/sendResponse";

export interface IAppError extends Error {
  statusCode?: number;
  code?: string;
  meta?: {
    target?: string[];
    cause?: string;
  };
}

const globalErrorHandler = (
  err: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errors: string[] = [];

  // Handle Prisma DB Errors
  if (err.code && err.code.startsWith("P")) {
    if (err.code === "P2002") {
      statusCode = 409; // Conflict
      message = "Unique constraint violation";
      if (err.meta && Array.isArray(err.meta.target)) {
        errors = err.meta.target.map((t: string) => `${t} already exists`);
      }
    } else if (err.code === "P2003") {
      statusCode = 409; // Conflict
      message = "Foreign key constraint violation (reference check failed)";
    } else if (err.code === "P2025") {
      statusCode = 404; // Not Found
      message = err.meta?.cause || "Record to update or delete not found";
    }
  }

  // Auth credential error security check: always return 'Invalid credentials' for login failures
  if (
    message === "Password incorrect!" ||
    message === "Invalid credentials" ||
    (message === "Record not found" && req.path.endsWith("/login"))
  ) {
    message = "Invalid credentials";
    statusCode = 401;
  }

  // Active status check
  if (message === "User is inactive") {
    message = "Unauthorized";
    statusCode = 401;
  }

  res.status(statusCode).json(
    sendError(message, statusCode, errors.length > 0 ? errors : undefined)
  );
};

export default globalErrorHandler;
