import { Router } from "express";
import { create, accept, decline } from "../controllers/invitations";
import { verifyToken } from "../middleware/auth";

const router: Router = Router();

/* READ */
router.post("", verifyToken as any, create as any)
router.post("/:id", verifyToken as any, accept as any)
router.delete("/:id", verifyToken as any, decline as any)

export default router;