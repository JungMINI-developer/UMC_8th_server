import { Request, Response, NextFunction } from "express";
import {
  createLp,
  getLps,
  getLpById,
  updateLp,
  deleteLp,
} from "./lp.service";
import { success } from "../../common/response";
import { AppError } from "../../common/AppError";

const parseId = (raw: string) => {
  const id = Number(raw);
  if (Number.isNaN(id)) {
    throw new AppError(400, "INVALID_PARAM", "유효하지 않은 LP ID입니다");
  }
  return id;
};

export const createLpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, lpJacket } = req.body;
    if (!title || !description) {
      throw new AppError(400, "INVALID_BODY", "title, description은 필수입니다");
    }
    const result = await createLp(req.userId!, { title, description, lpJacket });
    return success(res, result, 201);
  } catch (err) {
    next(err);
  }
};

export const getLpsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const result = await getLps(page, limit);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const getLpByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getLpById(parseId(req.params.id));
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const updateLpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, lpJacket } = req.body;
    const result = await updateLp(parseId(req.params.id), req.userId!, {
      title,
      description,
      lpJacket,
    });
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const deleteLpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteLp(parseId(req.params.id), req.userId!);
    return success(res, result);
  } catch (err) {
    next(err);
  }
};
