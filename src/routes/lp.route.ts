import { Router } from "express";
import {
  createLpHandler,
  getLpsHandler,
  getLpByIdHandler,
  updateLpHandler,
  deleteLpHandler,
  likeLpHandler,
  unlikeLpHandler,
  createStarHandler,
  updateStarHandler,
  deleteStarHandler,
} from "../domains/lp/lp.controller";
import {
  createCommentHandler,
  getCommentsHandler,
} from "../domains/comment/comment.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/", authenticate, createLpHandler);
router.get("/", getLpsHandler);
router.get("/:id", getLpByIdHandler);
router.patch("/:id", authenticate, updateLpHandler);
router.delete("/:id", authenticate, deleteLpHandler);

router.post("/:id/likes", authenticate, likeLpHandler);
router.delete("/:id/likes", authenticate, unlikeLpHandler);

router.post("/:id/stars", authenticate, createStarHandler);
router.patch("/:id/stars", authenticate, updateStarHandler);
router.delete("/:id/stars", authenticate, deleteStarHandler);

router.post("/:id/comments", authenticate, createCommentHandler);
router.get("/:id/comments", getCommentsHandler);

export default router;
