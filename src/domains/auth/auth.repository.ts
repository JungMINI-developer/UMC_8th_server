import { prisma } from "../../db.prisma";

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  return prisma.user.create({ data });
};
