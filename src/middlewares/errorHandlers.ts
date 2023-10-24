import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
  });
};

export default errorHandler;
