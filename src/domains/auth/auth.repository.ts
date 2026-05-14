import { prisma } from "../../db.prisma";

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

// TODO: 유저 정보 조회 로직 추가
export const findById = async (userId: number) => {
  return prisma.user.findFirst({ where: { userId, deletedAt: null } });
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  return prisma.user.create({ data });
};

// TODO: 유저 정보 업데이트 로직 추가
export const updateUser = async (
  userId: number,
  data: { name?: string; profile?: string }
) => {
  return prisma.user.update({ where: { userId }, data });
};

// TODO: 유저 삭제 로직 추가
export const softDeleteUser = async (userId: number) => {
  return prisma.user.update({
    where: { userId },
    data: { deletedAt: new Date() },
  });
};
