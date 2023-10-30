import { Router } from "express";
import { uploadImage } from "../middleware/storage"
import { verifyToken } from "../middleware/auth";
import { createEvent, getEventPage, getEvents, getFilters, searchEvents } from "../controllers/events";

const router: Router = Router();

router.post("", getEvents as any)
router.post("/create", verifyToken as any, uploadImage as any, createEvent as any);

router.get("/search", searchEvents as any)
router.get("/:_id", getEventPage as any)
router.get("/filters", getFilters as any)

export default router;