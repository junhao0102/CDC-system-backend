import { Request, Response } from "express";
import { Prisma } from "prisma/generated/client";
import { ZodError } from "zod";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { registerUserSchema } from "@/validator/user_schema";
import transporter from "@/utils/mail";
import { env } from "@/config/env_validation";
import { mailTemplate, statusTemplate } from "@/templates/mail";

async function registerUser(req: Request, res: Response) {
  try {
    const { email, username, password, role } = registerUserSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
        verification_token: verificationToken,
      },
    });

    const verificationUrl = `${env.BACK_BASE_URL}/api/user/verify?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"師大崇德社系統" <${env.GMAIL_USER}>`,
      to: email,
      subject: "🌟 請驗證您的註冊信箱",
      html: mailTemplate(verificationUrl),
    });

    console.log(`Register user successful: ${username} ${role}`);
    return res.status(200).json({ message: "Register user successful", user: { username, role } });
  } catch (e) {
    // 1. Zod 驗證格式
    if (e instanceof ZodError) {
      const error = e.issues[0];
      const message = error?.message;
      const key = error?.path[0];
      return res.status(400).json({ message, key });
    }

    // 2. Prisma 唯一鍵衝突
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.error("Email already register");
        return res.status(409).json({ message: "Email already register" });
      }
    }

    if (e instanceof Error) {
      console.error("Register error:", e.message);
      return res.status(500).json({ message: e.message });
    }

    console.error("Unknown error");
    return res.status(500).json({ message: "Unknown error" });
  }
}

async function verifyUser(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res
        .status(404)
        .send(
          statusTemplate("驗證失敗", "請檢查網址是否正確", "重新註冊", env.FRONT_BASE_URL, false),
        );
    }

    const user = await prisma.user.findFirst({
      where: { verification_token: token },
    });

    if (!user) {
      return res
        .status(404)
        .send(statusTemplate("驗證失敗", "此驗證已失效", "前往註冊", env.FRONT_BASE_URL, false));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_verified: true,
        verification_token: null,
      },
    });
    return res
      .status(200)
      .send(
        statusTemplate(
          "驗證成功！",
          "您的帳號已順利啟用，現在可以開始紀錄您的點數了。",
          "立即登入使用",
          env.FRONT_BASE_URL,
          true,
        ),
      );
  } catch (e) {
    console.error("Verify error:", e);
    return res
      .status(500)
      .send(
        statusTemplate(
          "伺服器錯誤",
          "目前系統忙碌中，請稍後再試。",
          "回到註冊頁面",
          env.FRONT_BASE_URL,
          false,
        ),
      );
  }
}

export { registerUser, verifyUser };
