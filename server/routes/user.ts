import { Router } from "express";
import { getCurrentUser, deleteUser } from "../controllers/user";
import { verifyToken } from "../middleware/auth";

const router = Router();

/* READ */
router.get("", verifyToken as any, getCurrentUser as any);
router.delete("", verifyToken as any, deleteUser as any);


export default router;