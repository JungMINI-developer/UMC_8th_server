import { AppError } from "../../common/AppError";
import { findLpById } from "../lp/lp.repository";
import {
  createComment as createCommentRepo,
  findCommentsByLp,
  countCommentsByLp,
  findCommentById,
  updateComment as updateCommentRepo,
  softDeleteComment,
} from "./comment.repository";

const ensureLpExists = async (lpId: number) => {
  const lp = await findLpById(lpId);
  if (!lp) {
    throw new AppError(404, "LP_NOT_FOUND", "LP를 찾을 수 없습니다");
  }
};

export const createComment = async (
  lpId: number,
  userId: number,
  content: string
) => {
  await ensureLpExists(lpId);
  return createCommentRepo({ authorId: userId, lpId, content });
};

export const getComments = async (
  lpId: number,
  page: number,
  limit: number
) => {
  await ensureLpExists(lpId);

  const skip = (page - 1) * limit;
  const [comments, total] = await Promise.all([
    findCommentsByLp({ lpId, skip, take: limit }),
    countCommentsByLp(lpId),
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateComment = async (
  commentId: number,
  userId: number,
  content: string
) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError(404, "COMMENT_NOT_FOUND", "댓글을 찾을 수 없습니다");
  }
  if (comment.authorId !== userId) {
    throw new AppError(403, "FORBIDDEN", "수정 권한이 없습니다");
  }
  return updateCommentRepo(commentId, content);
};

export const deleteComment = async (commentId: number, userId: number) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError(404, "COMMENT_NOT_FOUND", "댓글을 찾을 수 없습니다");
  }
  if (comment.authorId !== userId) {
    throw new AppError(403, "FORBIDDEN", "삭제 권한이 없습니다");
  }
  await softDeleteComment(commentId);
  return { message: "댓글이 삭제되었습니다" };
};
