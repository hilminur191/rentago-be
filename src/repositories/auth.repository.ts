import prisma from "../lib/prisma";
import { genSaltSync, hashSync } from "bcrypt";
import { IRegisterParam, ILoginParam } from "../interfaces/auth.types";
import jwt from "jsonwebtoken";
import mailer from "../utils/nodemailer";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function registerUser(params: IRegisterParam) {
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
  });
  if (existing) throw new Error("Email already registered");

  const token = randomUUID();
  const expiredAt = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.temporaryToken.create({
    data: {
      token,
      expiredAt,
      type: "VERIFY_EMAIL",
      user: {
        create: {
          email: params.email,
          name: params.name || "New User",
          role: params.role,
          password: "",
          isVerified: false,
        },
      },
    },
  });

  const link = `http://localhost:3000/auth/verify-email?token=${token}`;

  await mailer.sendMail({
    from: `"Rentago" <rentago.project@gmail.com>`,
    to: params.email,
    subject: "Verify your email",
    html: `
      <p>Hello ${params.name || "User"},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${link}">${link}</a>
    `,
  });

  return { message: "Verification email sent" };
}

export async function checkVerifyToken(token: string) {
  const temp = await prisma.temporaryToken.findUnique({ where: { token } });
  if (!temp || temp.expiredAt < new Date()) return null;
  return temp;
}

export async function createUserAfterVerify(token: string, password: string) {
  const tempToken = await prisma.temporaryToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tempToken) throw new Error("Invalid token");
  if (tempToken.expiredAt < new Date()) throw new Error("Token expired");
  if (tempToken.type !== "VERIFY_EMAIL") throw new Error("Invalid token type");

  const salt = genSaltSync(10);
  const hashed = hashSync(password, salt);

  const user = await prisma.user.update({
    where: { id: tempToken.userId },
    data: {
      password: hashed,
      isVerified: true,
    },
  });

  await prisma.temporaryToken.delete({ where: { id: tempToken.id } });

  return user;
}

export async function requestResetPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  if (!user.password)
    throw new Error("Reset password not available for social login");

  const token = randomUUID();
  const expiredAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.temporaryToken.create({
    data: {
      token,
      expiredAt,
      type: "RESET_PASSWORD",
      userId: user.id,
    },
  });

  const link = `http://localhost:3000/auth/reset-password/confirm?token=${token}`;

  await mailer.sendMail({
    from: `"Rentago" <rentago.project@gmail.com>`,
    to: email,
    subject: "Reset your password",
    html: `
      <p>Hello ${user.name || "User"},</p>
      <p>We received a request to reset your password. Click the link below to continue:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 30 minutes. If you didn’t request this, you can ignore it.</p>
    `,
  });

  return { message: "Reset password email sent" };
}

export async function confirmResetPassword(token: string, newPassword: string) {
  const tempToken = await prisma.temporaryToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tempToken) throw new Error("Invalid token");
  if (tempToken.expiredAt < new Date()) throw new Error("Token expired");
  if (tempToken.type !== "RESET_PASSWORD")
    throw new Error("Invalid token type");

  const salt = genSaltSync(10);
  const hashed = hashSync(newPassword, salt);

  const user = await prisma.user.update({
    where: { id: tempToken.userId },
    data: { password: hashed },
  });

  await prisma.temporaryToken.delete({ where: { id: tempToken.id } });

  return { message: "Password has been reset successfully", userId: user.id };
}


export async function loginUser(params: ILoginParam) {
  const { email, password } = params;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  if (!user.isVerified) {
    throw new Error("Account not verified");
  }

  // cek password
  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.SECRET_KEY!,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
  };
}
