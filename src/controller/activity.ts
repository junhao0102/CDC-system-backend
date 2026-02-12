import { Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "prisma/generated/client";
import { prisma } from "lib/prisma";
import { createActivitySchema, participateActivitySchema } from "@/validator/activity_schema";
import { idSchema } from "@/validator/common_schema";
import crypto from "crypto";

async function getActivity(req: Request, res: Response) {
  try {
    const activities = await prisma.activity.findMany();
    res.status(201).json({ message: "Get activities successful", activities });
  } catch (e) {
    if (e instanceof Error) {
      console.error("Get activities error:", e.message);
      return res.status(500).json({ message: e.message });
    }

    console.error("Unknown error");
    return res.status(500).json({ message: "Unknown error" });
  }
}

async function createActivity(req: Request, res: Response) {
  try {
    const { activity_name, date, start_time, end_time } = createActivitySchema.parse(req.body);

    const qrCodeToken = crypto.randomBytes(16).toString("hex");

    const activity = await prisma.activity.create({
      data: {
        activity_name,
        date,
        start_time,
        end_time,
        qr_code: qrCodeToken,
      },
    });

    res.status(201).json({ message: "Create activity successful", activity });
  } catch (e) {
    // 1. Zod 驗證格式
    if (e instanceof ZodError) {
      const error = e.issues[0];
      const message = error?.message;
      const key = error?.path[0];
      return res.status(400).json({ message, key });
    }
    // 2. Prisma 唯一鍵衝突
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.error("Qrcode already exist");
        return res.status(409).json({ message: "Qrcode already exist" });
      }
    }
    if (e instanceof Error) {
      console.error("Create activity error:", e.message);
      return res.status(500).json({ message: e.message });
    }

    console.error("Unknown error");
    return res.status(500).json({ message: "Unknown error" });
  }
}

async function deleteActivity(req: Request, res: Response) {
  try {
    const { id } = idSchema.parse(req.params);
    const activity = await prisma.activity.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Delete activity successful", activity });
  } catch (e) {
    // 1. zod 進行驗證
    if (e instanceof ZodError) {
      const error = e.issues[0];
      const message = error?.message;
      const key = error?.path[0];
      return res.status(400).json({ message, key });
    }

    // 2. Prisma 目標不存在
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        console.error("Activity not found");
        return res.status(404).json({ message: "Activity not found" });
      }
    }

    if (e instanceof Error) {
      console.error(e.message);
      return res.status(500).json({ message: e.message });
    }

    console.error("Unknown error");
    return res.status(500).json({ message: "Unknown error" });
  }
}

async function participateActivity(req: Request, res: Response) {
  try {
    const { qr_code } = participateActivitySchema.parse(req.params);

    const activity = await prisma.activity.findUnique({
      where: {
        qr_code,
      },
    });
    if (!activity) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await prisma.participate.create({
      data: {
        user_id: userId,
        activity_id: activity.id,
      },
    });

    return res.status(200).json({ message: "Participate activity successful", activity });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        console.error("Activity not found");
        return res.status(404).json({ message: "Activity not found" });
      }
      if (e.code === "P2002") {
        console.error("Already Sign in");
        return res.status(409).json({ message: "Already Sign in" });
      }
    }

    if (e instanceof Error) {
      console.error(e.message);
      return res.status(500).json({ message: e.message });
    }

    console.error("Unknown error");
    return res.status(500).json({ message: "Unknown error" });
  }
}

export { createActivity, getActivity, deleteActivity, participateActivity };
