import { Router } from "express";
import userRouter from "@/routes/user";
import authRouter from "@/routes/auth";
import activityRouter from "@/routes/activity";
import recordRouter from "@/routes/record";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);

router.use("/activity", activityRouter);

router.use("/record", recordRouter);

export default router;
