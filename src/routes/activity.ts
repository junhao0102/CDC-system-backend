import { Router } from "express";
import { createActivity, getActivity, deleteActivity,participateActivity } from "@/controller/activity";
import { Auth, requireRole } from "@/middleware/auth";
import { Role } from "prisma/generated/enums";

const router = Router();

router.get("/", Auth, getActivity);

router.post("/", Auth, requireRole(Role.ADMIN), createActivity);

router.delete("/:id", Auth, requireRole(Role.ADMIN), deleteActivity);

router.post("/participate/:qr_code", Auth, participateActivity);

export default router;
