import { TagName } from "../../types/tag";
import { prisma } from "../../db.prisma";

export const createLp = async (data: {
  authorId: number;
  title: string;
  description: string;
  lpJacket?: string;
}) => {
  return prisma.lp.create({ data });
};

const lpInclude = {
  author: { select: { userId: true, name: true } },
  _count: { select: { likes: true } },
  tags: { include: { tag: true } },
} as const;

export const findLps = async (params: { skip: number; take: number }) => {
  return prisma.lp.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    skip: params.skip,
    take: params.take,
    include: lpInclude,
  });
};

export const countLps = async () => {
  return prisma.lp.count({ where: { deletedAt: null } });
};

export const findLpById = async (lpId: number) => {
  return prisma.lp.findFirst({
    where: { lpId, deletedAt: null },
    include: lpInclude,
  });
};

export const updateLp = async (
  lpId: number,
  data: { title?: string; description?: string; lpJacket?: string }
) => {
  return prisma.lp.update({ where: { lpId }, data });
};

export const softDeleteLp = async (lpId: number) => {
  return prisma.lp.update({
    where: { lpId },
    data: { deletedAt: new Date() },
  });
};

export const findLike = async (userId: number, lpId: number) => {
  return prisma.like.findUnique({
    where: { userId_lpId: { userId, lpId } },
  });
};

export const createLike = async (userId: number, lpId: number) => {
  return prisma.like.create({ data: { userId, lpId } });
};

export const deleteLike = async (userId: number, lpId: number) => {
  return prisma.like.delete({
    where: { userId_lpId: { userId, lpId } },
  });
};

export const countLikes = async (lpId: number) => {
  return prisma.like.count({ where: { lpId } });
};

export const findStar = async (userId: number, lpId: number) => {
  return prisma.star.findUnique({
    where: { userId_lpId: { userId, lpId } },
  });
};

export const createStar = async (
  userId: number,
  lpId: number,
  rate: number
) => {
  return prisma.star.create({ data: { userId, lpId, rate } });
};

export const updateStar = async (
  userId: number,
  lpId: number,
  rate: number
) => {
  return prisma.star.update({
    where: { userId_lpId: { userId, lpId } },
    data: { rate },
  });
};

export const deleteStar = async (userId: number, lpId: number) => {
  return prisma.star.delete({
    where: { userId_lpId: { userId, lpId } },
  });
};

export const findTag = async (tagName: TagName) => {
  return prisma.tag.findUnique({ where: { tagName } });
};

export const setLpTags = async (lpId: number, tagIds: number[]) => {
  await prisma.lpTagMapping.deleteMany({ where: { lpId } });
  if (tagIds.length > 0) {
    await prisma.lpTagMapping.createMany({
      data: tagIds.map((tagId) => ({ lpId, tagId })),
    });
  }
};
