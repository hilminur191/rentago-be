import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "projectrentago@gmail.com",
    pass: "ixua mcki uquu zbdg",
  },
});

export default mailer;