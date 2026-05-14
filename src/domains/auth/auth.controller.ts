import { Request, Response, NextFunction } from "express";
import {
  signup,
  login,
  getMyInfo,
  getUserInfo,
  updateProfile,
  updateProfileImage,
  withdraw,
} from "./auth.service";
import { success } from "../../common/response";
import { AppError } from "../../common/AppError";

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

export const getMyInfoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getMyInfo(req.userId!);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const getUserInfoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      throw new AppError(400, "INVALID_PARAM", "유효하지 않은 유저 ID입니다");
    }
    const result = await getUserInfo(userId);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const updateProfileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, profile } = req.body;
    if (!name) {
      throw new AppError(400, "INVALID_BODY", "name은 필수입니다");
    }
    const result = await updateProfile(req.userId!, name, profile);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const updateProfileImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      throw new AppError(400, "INVALID_BODY", "profile은 필수입니다");
    }
    const result = await updateProfileImage(req.userId!, profile);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const withdrawHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await withdraw(req.userId!);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};
