import { Router } from "express";
import { getMyrecord } from "@/controller/record";
import { Auth } from "@/middleware/auth";

const router = Router();

router.get("/my_record", Auth, getMyrecord);

export default router;
