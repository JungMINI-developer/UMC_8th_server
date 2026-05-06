import { Request, Response, NextFunction } from "express";
import { signup, login } from "./auth.service";
import { success } from "../../common/response";

export const signupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await signup(req.body);
    return success(res, result, 201);
  } catch (err) {
    next(err);
  }
};

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await login(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};
