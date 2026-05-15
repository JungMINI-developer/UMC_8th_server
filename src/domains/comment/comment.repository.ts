import { prisma } from "../../db.prisma";

const commentInclude = {
  author: { select: { userId: true, name: true } },
} as const;

export const createComment = async (data: {
  authorId: number;
  lpId: number;
  content: string;
}) => {
  return prisma.comment.create({ data, include: commentInclude });
};

export const findCommentsByLp = async (params: {
  lpId: number;
  skip: number;
  take: number;
}) => {
  return prisma.comment.findMany({
    where: { lpId: params.lpId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    skip: params.skip,
    take: params.take,
    include: commentInclude,
  });
};

export const countCommentsByLp = async (lpId: number) => {
  return prisma.comment.count({ where: { lpId, deletedAt: null } });
};

export const findCommentById = async (commentId: number) => {
  return prisma.comment.findFirst({
    where: { commentId, deletedAt: null },
    include: commentInclude,
  });
};

export const updateComment = async (commentId: number, content: string) => {
  return prisma.comment.update({
    where: { commentId },
    data: { content },
    include: commentInclude,
  });
};

export const softDeleteComment = async (commentId: number) => {
  return prisma.comment.update({
    where: { commentId },
    data: { deletedAt: new Date() },
  });
};
