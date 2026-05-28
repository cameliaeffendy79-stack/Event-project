import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({
  to,
  subject,
  html,
}: SendMailParams) {
  await transporter.sendMail({
    from: `"Event Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}