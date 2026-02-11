import { z } from "zod";

const idSchema = z.object({
  id: z.coerce.number("Invalid id"),
});

export { idSchema };
