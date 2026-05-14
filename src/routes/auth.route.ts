import { Router } from "express";
import {
  signupHandler,
  loginHandler,
  getMyInfoHandler,
  getUserInfoHandler,
  updateProfileHandler,
  updateProfileImageHandler,
  withdrawHandler,
} from "../domains/auth/auth.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);

router.get("/me", authenticate, getMyInfoHandler);
router.patch("/me", authenticate, updateProfileHandler);
router.patch("/me/profile-image", authenticate, updateProfileImageHandler);
router.delete("/me", authenticate, withdrawHandler);

router.get("/users/:id", authenticate, getUserInfoHandler);

export default router;
