import { Router } from "express";
import { registerUser, verifyUser } from "@/controller/user";

const router = Router();

router.get("/verify", verifyUser);

router.post("/register", registerUser);

export default router;
