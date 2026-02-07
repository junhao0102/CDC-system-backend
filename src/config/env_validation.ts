import "dotenv/config";
import { z } from "zod";

// 定義 env 驗證格式
const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  FRONT_BASE_URL: z.string().url(),
  BACK_BASE_URL: z.string().url(),
  GMAIL_USER: z.string().email(),
  GMAIL_PASSWORD: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:");
  console.error(Object.keys(_env.error.flatten().fieldErrors));
  process.exit(1);
}

export const env = _env.data;
