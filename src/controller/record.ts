import { Request, Response } from "express";
import { prisma } from "lib/prisma";

async function getMyrecord(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    const myRecords = await prisma.participate.findMany({
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
    });

    const responseRecord = myRecords.map((record) => ({
      id: record.id,
      activity_name: record.activity.activity_name,
      date: record.activity.date,
    }));

    res.status(201).json({ message: "Get activities successful", my_records: responseRecord });
  } catch (e) {
    if (e instanceof Error) {
      console.error("Get activities error:", e.message);
      return res.status(500).json({ message: e.message });
    }

    console.error("Unknown error");
    return res.status(500).json({ message: "Unknown error" });
  }
}

export { getMyrecord };
