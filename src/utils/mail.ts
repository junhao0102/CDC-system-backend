import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "@/config/env_validation";

const options: SMTPTransport.Options = {
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(options);

transporter.verify((error, success) => {
  if (error) {
    console.error("Mailer start error:", error);
  } else {
    console.log("Mailer start successful");
  }
});

export default transporter;
