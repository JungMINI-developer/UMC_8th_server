import { TagName } from "../../types/tag";
import { AppError } from "../../common/AppError";
import {
  createLp as createLpRepo,
  findLps,
  countLps,
  findLpById,
  updateLp as updateLpRepo,
  softDeleteLp,
  findLike,
  createLike,
  deleteLike,
  countLikes,
  findStar,
  createStar,
  updateStar,
  deleteStar,
  findTag,
  setLpTags,
} from "./lp.repository";

const VALID_TAGS = Object.values(TagName);

const validateTags = (tags: string[]): TagName[] => {
  const normalized = [...new Set(tags.map((t) => t.trim()).filter(Boolean))];

  for (const tag of normalized) {
    if (!VALID_TAGS.includes(tag as TagName)) {
      throw new AppError(
        400,
        "INVALID_TAG",
        `유효하지 않은 태그입니다: ${tag} (가능한 값: ${VALID_TAGS.join(", ")})`
      );
    }
  }

  return normalized as TagName[];
};

const syncTags = async (lpId: number, tags: TagName[]) => {
  const tagRecords = await Promise.all(tags.map(findTag));

  const tagIds = tagRecords.map((tag, i) => {
    if (!tag) {
      throw new AppError(
        500,
        "TAG_NOT_SEEDED",
        `태그가 DB에 시드되지 않았습니다: ${tags[i]}`
      );
    }
    return tag.tagId;
  });

  await setLpTags(lpId, tagIds);
};

const ensureLpExists = async (lpId: number) => {
  const lp = await findLpById(lpId);
  if (!lp) {
    throw new AppError(404, "LP_NOT_FOUND", "LP를 찾을 수 없습니다");
  }
  return lp;
};

export const createLp = async (
  authorId: number,
  data: {
    title: string;
    description: string;
    lpJacket?: string;
    tags?: string[];
  }
) => {
  const { tags, ...lpData } = data;
  const validTags = tags ? validateTags(tags) : [];
  const lp = await createLpRepo({ authorId, ...lpData });
  if (validTags.length > 0) {
    await syncTags(lp.lpId, validTags);
  }
  return findLpById(lp.lpId);
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
  data: {
    title?: string;
    description?: string;
    lpJacket?: string;
    tags?: string[];
  }
) => {
  const lp = await findLpById(lpId);
  if (!lp) {
    throw new AppError(404, "LP_NOT_FOUND", "LP를 찾을 수 없습니다");
  }
  if (lp.authorId !== userId) {
    throw new AppError(403, "FORBIDDEN", "수정 권한이 없습니다");
  }

  const { tags, ...lpData } = data;
  const validTags = tags !== undefined ? validateTags(tags) : undefined;
  await updateLpRepo(lpId, lpData);
  if (validTags !== undefined) {
    await syncTags(lpId, validTags);
  }
  return findLpById(lpId);
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

export const likeLp = async (lpId: number, userId: number) => {
  await ensureLpExists(lpId);

  const existing = await findLike(userId, lpId);
  if (existing) {
    throw new AppError(409, "ALREADY_LIKED", "이미 좋아요한 LP입니다");
  }

  await createLike(userId, lpId);
  const likeCount = await countLikes(lpId);
  return { message: "좋아요를 등록했습니다", likeCount };
};

export const unlikeLp = async (lpId: number, userId: number) => {
  await ensureLpExists(lpId);

  const existing = await findLike(userId, lpId);
  if (!existing) {
    throw new AppError(404, "LIKE_NOT_FOUND", "좋아요하지 않은 LP입니다");
  }

  await deleteLike(userId, lpId);
  const likeCount = await countLikes(lpId);
  return { message: "좋아요를 취소했습니다", likeCount };
};

const validateRate = (rate: unknown) => {
  if (typeof rate !== "number" || Number.isNaN(rate) || rate < 0 || rate > 5) {
    throw new AppError(400, "INVALID_RATE", "평점은 0~5 사이의 숫자여야 합니다");
  }
};

export const createLpStar = async (
  lpId: number,
  userId: number,
  rate: number
) => {
  await ensureLpExists(lpId);
  validateRate(rate);

  const existing = await findStar(userId, lpId);
  if (existing) {
    throw new AppError(409, "ALREADY_RATED", "이미 평점을 등록한 LP입니다");
  }

  return createStar(userId, lpId, rate);
};

export const updateLpStar = async (
  lpId: number,
  userId: number,
  rate: number
) => {
  await ensureLpExists(lpId);
  validateRate(rate);

  const existing = await findStar(userId, lpId);
  if (!existing) {
    throw new AppError(404, "STAR_NOT_FOUND", "등록한 평점이 없습니다");
  }

  return updateStar(userId, lpId, rate);
};

export const deleteLpStar = async (lpId: number, userId: number) => {
  await ensureLpExists(lpId);

  const existing = await findStar(userId, lpId);
  if (!existing) {
    throw new AppError(404, "STAR_NOT_FOUND", "등록한 평점이 없습니다");
  }

  await deleteStar(userId, lpId);
  return { message: "평점을 삭제했습니다" };
};
