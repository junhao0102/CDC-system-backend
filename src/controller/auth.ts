import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { loginSchema } from "@/validator/auth_schema";
import { prisma } from "lib/prisma";

async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
        is_verified: true,
      },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid user name or password", key: "password" });
    }
    if (!user.is_verified) {
      return res
        .status(401)
        .json({ message: "Please check your inbox to verify your email", key: "email" });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    return res.status(200).json({
      message: "Login successful",
      username: user.username,
      role: user.role,
    });
  } catch (e) {
    // zod 進行驗證
    if (e instanceof ZodError) {
      const error = e.issues[0];
      const message = error?.message;
      const key = error?.path[0];
      return res.status(400).json({ message, key });
    }

    if (e instanceof Error) {
      return res.status(500).json({ message: e.message });
    }

    return res.status(500).json({ message: "Unknown error" });
  }
}

async function me(req: Request, res: Response) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ userId: req.session.userId , role: req.session.role});
}

async function logout(req: Request, res: Response) {
  // 刪除 server 端 session
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    // 清掉瀏覽器 cookie
    res.clearCookie("sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({ message: "Logged out" });
  });
}

export { login, logout, me };
