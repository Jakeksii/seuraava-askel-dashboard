import { Router } from "express";
import { createOrganization, getOrganization, getDetailedOrganization, deleteOrganization, getAllOrganizations } from "../controllers/organization";
import { verifyToken } from "../middleware/auth";

const router = Router();

/* READ */
router.post("", verifyToken as any , createOrganization as any);
router.get("/:id", getOrganization as any)
router.get("/organizations/all", getAllOrganizations as any)
router.get("/:id/detailed", verifyToken as any, getDetailedOrganization as any)
router.delete("/:id", verifyToken as any, deleteOrganization as any);


export default router;