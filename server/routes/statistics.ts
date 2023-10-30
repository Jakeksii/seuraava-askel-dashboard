import { Router } from "express";
import { getTest, createEventStats, updateEventStats } from "../controllers/statistics";


const router = Router();

router.get("", getTest as any);
router.post("", createEventStats as any);
router.patch("/:id", updateEventStats as any);


export default router;
