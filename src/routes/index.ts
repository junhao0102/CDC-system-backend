import { Router } from "express";
import userRouter from "@/routes/user";
import authRouter from "@/routes/auth";
import activityRouter from "@/routes/activity";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);

router.use("/activity", activityRouter);

export default router;
