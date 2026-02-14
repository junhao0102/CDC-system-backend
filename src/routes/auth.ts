import { Router } from "express";
import { login, me, logout } from "@/controller/auth";
import { Auth } from "@/middleware/auth";

const router = Router();

router.post("/login", login);

router.get("/me", Auth, me);

router.post("/logout", logout);

export default router;
