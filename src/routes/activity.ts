import { Router } from "express";
import {
  createActivity,
  getActivity,
  deleteActivity,
  signIn,
  getTodayActivities,
  getRank,
} from "@/controller/activity";
import { Auth, requireRole } from "@/middleware/auth";
import { Role } from "prisma/generated/enums";

const router = Router();

router.get("/", Auth, getActivity);

router.post("/", Auth, requireRole(Role.ADMIN), createActivity);

router.delete("/:id", Auth, requireRole(Role.ADMIN), deleteActivity);

router.post("/sign_in/:qr_code", Auth, signIn);

router.get("/today_activity", Auth, requireRole(Role.ADMIN), getTodayActivities);

router.get("/rank", Auth, getRank);

export default router;
