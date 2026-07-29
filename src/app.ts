import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Root Health Endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Trends Bird E-commerce Dashboard Backend API Server Running",
    status: "healthy",
  });
});

// API Route Handlers (Supported under both /api and /api/v1)
app.use("/api/v1", router);
// app.use("/api", router);

// Global Error Handler Middleware
app.use(globalErrorHandler);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
