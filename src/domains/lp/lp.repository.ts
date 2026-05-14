import { prisma } from "../../db.prisma";

export const createLp = async (data: {
  authorId: number;
  title: string;
  description: string;
  lpJacket?: string;
}) => {
  return prisma.lp.create({ data });
};

export const findLps = async (params: { skip: number; take: number }) => {
  return prisma.lp.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    skip: params.skip,
    take: params.take,
    include: {
      author: { select: { userId: true, name: true } },
      _count: { select: { likes: true } },
    },
  });
};

export const countLps = async () => {
  return prisma.lp.count({ where: { deletedAt: null } });
};

export const findLpById = async (lpId: number) => {
  return prisma.lp.findFirst({
    where: { lpId, deletedAt: null },
    include: {
      author: { select: { userId: true, name: true } },
      _count: { select: { likes: true } },
    },
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
