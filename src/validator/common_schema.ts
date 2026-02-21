import { z } from "zod";

const idSchema = z.object({
  id: z.coerce.number("Invalid id"),
});

const paginationSchema = z.object({
  page: z.coerce.number().min(1, "Page must be greater than 0"),
});

export { idSchema, paginationSchema };
