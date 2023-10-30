import { Router } from "express";
import { createOrganizationPage, findOrganizationPage } from "../controllers/organizationPage";
import { verifyToken } from "../middleware/auth";
import { uploadImage } from "../middleware/storage";

const router = Router();

/* READ */
router.post("", verifyToken as any, uploadImage as any, createOrganizationPage as any);
router.get("", findOrganizationPage as any)

export default router;