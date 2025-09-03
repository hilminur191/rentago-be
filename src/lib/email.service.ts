// Nurbani
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // contoh: smtp.supabase.io
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // biasanya "apikey"
    pass: process.env.SMTP_PASS, // API key Supabase
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER, // alamat pengirim
    to,
    subject,
    html,
  });
};
