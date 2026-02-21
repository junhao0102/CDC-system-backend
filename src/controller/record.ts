import { Request, Response } from "express";
import { prisma } from "lib/prisma";
import { ZodError } from "zod";
import { paginationSchema } from "@/validator/common_schema";
import { env } from "@/config/env_validation";

async function getMyrecord(req: Request, res: Response) {
  try {
    const userId = req.session.userId;

    const { page } = paginationSchema.parse(req.query);
    const PAGE_SIZE = env.DEFAULT_PAGE_SIZE;
    const skipValue = (page - 1) * PAGE_SIZE;

    const [myRecords, totalCount] = await Promise.all([
      prisma.participate.findMany({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
          activity: {
            select: {
              activity_name: true,
              date: true,
              start_time: true,
              end_time: true,
            },
          },
        },
        skip: skipValue,
        take: PAGE_SIZE,
        orderBy: {
          activity: {
            date: "desc",
          },
        },
      }),
      prisma.participate.count(),
    ]);

    const responseRecord = myRecords.map((record) => ({
      id: record.id,
      activity_name: record.activity.activity_name,
      date: record.activity.date,
    }));

    res.status(201).json({
      message: "Get activities successful",
      rows: responseRecord,
      pagination: {
        page,
        page_size: PAGE_SIZE,
        total_pages: Math.ceil(totalCount / PAGE_SIZE),
      },
    });
  } catch (e) {
    if (e instanceof ZodError) {
          const error = e.issues[0];
          const message = error?.message;
          const key = error?.path[0];
          return res.status(400).json({ message, key });
        }
    if (e instanceof Error) {
      console.error("Get activities error:", e.message);
      return res.status(500).json({ message: e.message });
    }

    console.error("Unknown error");
    return res.status(500).json({ message: "Unknown error" });
  }
}

export { getMyrecord };
