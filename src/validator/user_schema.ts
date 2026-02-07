import z from "zod";
import { Role } from "prisma/generated/enums";

const registerUserSchema = z.object({
  email: z.email().min(1, "Email is required"),
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().trim().min(1, "Password is required"),
  role: z.nativeEnum(Role, "Invalid role"),
});

export { registerUserSchema };
