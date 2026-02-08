import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { z, ZodError } from "zod";
import { env } from "@/config/env_validation";
import { Role } from "prisma/generated/enums";

// 定義 jwt payload 驗證格式
const payloadSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.nativeEnum(Role),
});

// 擴充 Express Request 型別,讓路由能存取 req.user
export interface AuthRequest extends Request {
  user?: z.infer<typeof payloadSchema>;
}

function verifyJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const accessToken = req.cookies?.access_token;
  if (!accessToken) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const payload = jwt.verify(accessToken, env.JWT_SECRET);
    const validatedData = payloadSchema.parse(payload);
    req.user = validatedData;
    next();
  } catch (e) {
    // 1. jwt 驗證簽章與時效性
    if (e instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    // 2. zod 進行驗證 payload 格式
    if (e instanceof ZodError) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
}

export { verifyJWT };
