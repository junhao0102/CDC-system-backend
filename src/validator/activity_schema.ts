import { z } from "zod";

const createActivitySchema = z
  .object({
    activity_name: z.string().min(1, "Activiy name must not be null"),
    // 檢查格式為 YYYY-MM-DD
    date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
      message: "Date format must be YYYY-MM-DD",
    }),

    // 檢查格式為 HH:mm (24小時制)
    start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Start time format must be HH:mm",
    }),

    end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "End time format must be HH:mm",
    }),
  })
  .refine(
    (data) => {
      return data.end_time > data.start_time;
    },
    {
      message: "End time must > Start Time",
      path: ["endTime"],
    },
  );

export { createActivitySchema };
