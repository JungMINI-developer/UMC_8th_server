import { Router } from "express";
import authRouter from "./auth.route";
import lpRouter from "./lp.route";
import commentRouter from "./comment.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/lps", lpRouter);
router.use("/comments", commentRouter);

export default router;
