import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// SMTo -> Provider email pengirim 
// Set up SMTP logic 
export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

