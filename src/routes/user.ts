import { Router } from "express";
import { registerUser, verifyUser, getAllusers, updateRole } from "@/controller/user";
import { Auth, requireRole } from "@/middleware/auth";

const router = Router();

router.get("/verify", verifyUser);

router.post("/register", registerUser);

router.get("/users", Auth, requireRole("ADMIN"), getAllusers);

router.patch("/role/:id", Auth, requireRole("ADMIN"), updateRole);

export default router;
