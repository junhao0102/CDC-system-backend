import express from "express";
import routes from "@/routes/index.js";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "lib/prisma";
import { env } from "@/config/env_validation";

const app = express();

app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
    store: new PrismaSessionStore(prisma as any, {
      checkPeriod: 5 * 60 * 1000, // 5 min
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use("/api", routes);

// http server 、 ocpp server
(async () => {
  try {
    app.listen(3000, () => {
      console.log("HTTP server is listening on http://localhost:3000");
    });
  } catch (e) {
    console.error(`Start server error:, ${e}`);
  }
})();
