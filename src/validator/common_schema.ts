import { z } from "zod";

const idSchema = z.object({
  id: z.coerce.number("Invalid id"),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
});

export { idSchema, paginationSchema };
