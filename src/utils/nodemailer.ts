import nodemailer from "nodemailer";
import { GMAIL_EMAIL, GMAIL_PASS } from "../config";

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASS,
  },
});

export default mailer;
