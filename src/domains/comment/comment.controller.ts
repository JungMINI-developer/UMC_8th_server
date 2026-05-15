import { Request, Response, NextFunction } from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "./comment.service";
import { success } from "../../common/response";
import { AppError } from "../../common/AppError";

const parseId = (raw: string, label: string) => {
  const id = Number(raw);
  if (Number.isNaN(id)) {
    throw new AppError(400, "INVALID_PARAM", `유효하지 않은 ${label} ID입니다`);
  }
  return id;
};

export const createCommentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    if (!content) {
      throw new AppError(400, "INVALID_BODY", "content는 필수입니다");
    }
    const result = await createComment(
      parseId(req.params.id as string, "LP"),
      req.userId!,
      content
    );
    return success(res, result, 201);
  } catch (err) {
    next(err);
  }
};

export const getCommentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const result = await getComments(
      parseId(req.params.id as string, "LP"),
      page,
      limit
    );
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const updateCommentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    if (!content) {
      throw new AppError(400, "INVALID_BODY", "content는 필수입니다");
    }
    const result = await updateComment(
      parseId(req.params.id as string, "댓글"),
      req.userId!,
      content
    );
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

export const deleteCommentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteComment(
      parseId(req.params.id as string, "댓글"),
      req.userId!
    );
    return success(res, result);
  } catch (err) {
    next(err);
  }
};
