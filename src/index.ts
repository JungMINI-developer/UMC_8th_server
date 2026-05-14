import "dotenv/config";
import express, { Request, Response } from "express";
import type { Server } from "http";
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

let server: Server | undefined;

const startServer = (attempt = 0): void => {
  const s = app.listen(PORT);

  s.once("listening", () => {
    server = s;
    console.log(`Server running on http://localhost:${PORT}`);
  });

  s.once("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE" && attempt < 10) {
      console.warn(
        `Port ${PORT} busy, retry ${attempt + 1}/10 in 300ms...`
      );
      setTimeout(() => startServer(attempt + 1), 300);
      return;
    }
    console.error("Failed to start server:", err);
    process.exit(1);
  });
};

startServer();

let shuttingDown = false;
const shutdown = (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n[${signal}] shutting down...`);

  if (!server) {
    prisma.$disconnect().finally(() => process.exit(0));
    return;
  }

  server.closeAllConnections?.();

  server.close(async (err) => {
    if (err) console.error("server.close error:", err);
    await prisma.$disconnect();
    console.log("shutdown complete");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("force exit after timeout");
    process.exit(1);
  }, 3000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
