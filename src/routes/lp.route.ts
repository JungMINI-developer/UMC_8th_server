import { Router } from "express";
import {
  createLpHandler,
  getLpsHandler,
  getLpByIdHandler,
  updateLpHandler,
  deleteLpHandler,
} from "../domains/lp/lp.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/", authenticate, createLpHandler);
router.get("/", getLpsHandler);
router.get("/:id", getLpByIdHandler);
router.patch("/:id", authenticate, updateLpHandler);
router.delete("/:id", authenticate, deleteLpHandler);

export default router;
