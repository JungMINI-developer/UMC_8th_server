import "dotenv/config";
import express, { Request, Response } from "express";
import { prisma } from "./db.prisma";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { success } from "./common/response";
import { AppError } from "./common/AppError";
import router from "./routes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  return success(res, { status: "ok" });
});

app.use("/api/v1", router);

app.get("/test-error", (_req, _res, next) => {                
  throw new AppError(404, "TEST_ERROR", "테스트 에러입니다");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0); 
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
