import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/AppError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      resultType: "FAIL",
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      reason: err.reason,
      data: err.data,
    });
    return;
  }
  
  // 예상치 못한 에러를 잡는 폴백(fallback)
  console.error(err.stack);
  res.status(500).json({
    resultType: "FAIL",
    statusCode: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    reason: err.message ?? "Internal Server Error",
    data: null,
  });
};
