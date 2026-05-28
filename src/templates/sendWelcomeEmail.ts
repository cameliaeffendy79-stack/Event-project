import { sendMail } from "../utils/mailer";
import { welcomeEmailTemplate } from "../templates/welcomeEmailTemplate";

export async function sendWelcomeEmail(
  to: string,
  name: string
) {
  await sendMail({
    to,

    subject:
      "Welcome to Event Hub 🎉",

    html: welcomeEmailTemplate(name),
  });
}