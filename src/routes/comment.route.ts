import { Router } from "express";
import {
  updateCommentHandler,
  deleteCommentHandler,
} from "../domains/comment/comment.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.patch("/:id", authenticate, updateCommentHandler);
router.delete("/:id", authenticate, deleteCommentHandler);

export default router;
