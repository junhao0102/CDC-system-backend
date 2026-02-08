import { Router } from "express";
import userRouter from "@/routes/user";
import authRouter from "@/routes/auth";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);

export default router;
