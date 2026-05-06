import { Response } from "express";

interface SuccessResponse<T> {
  resultType: "SUCCESS";
  reason: null;
  data: T;
}

export const success = <T>(res: Response, data: T, status = 200): Response => {
  const body: SuccessResponse<T> = {
    resultType: "SUCCESS",
    reason: null,
    data,
  };
  return res.status(status).json(body);
};
