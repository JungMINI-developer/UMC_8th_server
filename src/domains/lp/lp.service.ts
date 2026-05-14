import { AppError } from "../../common/AppError";
import {
  createLp as createLpRepo,
  findLps,
  countLps,
  findLpById,
  updateLp as updateLpRepo,
  softDeleteLp,
} from "./lp.repository";

export const createLp = async (
  authorId: number,
  data: { title: string; description: string; lpJacket?: string }
) => {
  return createLpRepo({ authorId, ...data });
};

export const getLps = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [lps, total] = await Promise.all([
    findLps({ skip, take: limit }),
    countLps(),
  ]);

  return {
    lps,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getLpById = async (lpId: number) => {
  const lp = await findLpById(lpId);
  if (!lp) {
    throw new AppError(404, "LP_NOT_FOUND", "LP를 찾을 수 없습니다");
  }
  return lp;
};

export const updateLp = async (
  lpId: number,
  userId: number,
  data: { title?: string; description?: string; lpJacket?: string }
) => {
  const lp = await findLpById(lpId);
  if (!lp) {
    throw new AppError(404, "LP_NOT_FOUND", "LP를 찾을 수 없습니다");
  }
  if (lp.authorId !== userId) {
    throw new AppError(403, "FORBIDDEN", "수정 권한이 없습니다");
  }
  return updateLpRepo(lpId, data);
};

export const deleteLp = async (lpId: number, userId: number) => {
  const lp = await findLpById(lpId);
  if (!lp) {
    throw new AppError(404, "LP_NOT_FOUND", "LP를 찾을 수 없습니다");
  }
  if (lp.authorId !== userId) {
    throw new AppError(403, "FORBIDDEN", "삭제 권한이 없습니다");
  }
  await softDeleteLp(lpId);
  return { message: "LP가 삭제되었습니다" };
};
