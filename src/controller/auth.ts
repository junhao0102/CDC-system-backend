import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { loginSchema } from "@/validator/auth_schema";
import { AuthRequest } from "@/middleware/auth";
import { prisma } from "lib/prisma";
import { env } from "@/config/env_validation";

async function login(req: AuthRequest, res: Response) {
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
      return res.status(401).json({ message: "Invalid user name or password",key:"password" });
    }
    if (user.is_verified) {
      return res.status(401).json({ message: "Please check your inbox to verify your email" ,key:"email"});
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "3h" },
    );

    res.cookie("access_token", token, {
      httpOnly: true, // 防 XSS
      secure: false, // https 才要 true
      sameSite: "strict", // 防 CSRF
      maxAge: 60 * 60 * 1000 * 3, // 3h
    });

    return res
      .status(200)
      .json({ message: "Login successful", username: user.username, role: user.role, token });
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

export { login };
