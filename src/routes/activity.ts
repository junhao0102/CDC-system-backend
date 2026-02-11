import { Router } from "express";
import { createActivity, getActivity, deleteActivity } from "@/controller/activity";

const router = Router();

router.get("/", getActivity);

router.post("/", createActivity);

router.delete("/:id", deleteActivity);

export default router;
