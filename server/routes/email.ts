import { Router } from "express";
import { sendVerificationEmail, verifyEmail } from "../controllers/email"
import { verifyToken } from "../middleware/auth";

const router: Router = Router();

/* READ */
router.post("/verification", verifyToken as any, sendVerificationEmail as any);
router.post("/verify/:_id", verifyEmail as any);

export default router;