import "dotenv/config";
import express, { Request, Response } from "express";
import { prisma } from "./db.prisma";
import helmet from "helmet";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(helmet());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0); 
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
