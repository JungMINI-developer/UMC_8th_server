import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../common/AppError";
import { findByEmail, createUser } from "./auth.repository";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const existing = await findByEmail(data.email);
  if (existing) {
    throw new AppError(409, "EMAIL_ALREADY_EXISTS", "이미 사용 중인 이메일입니다");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  await createUser({ ...data, password: hashedPassword });

  return { message: "회원가입이 완료되었습니다" };
};

export const login = async (data: { email: string; password: string }) => {
  const user = await findByEmail(data.email);
  if (!user || !user.password) {
    throw new AppError(401, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new AppError(401, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다");
  }

  return {
    accessToken: generateToken(user.userId),
    user: {
      id: user.userId,
      email: user.email,
      nickname: user.name,
    },
  };
};
