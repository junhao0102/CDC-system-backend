import { z } from "zod";

const loginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().trim().min(1, "Password is required"),
});

export { loginSchema };
