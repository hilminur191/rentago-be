import prisma from "../lib/prisma";
import { compare, genSaltSync, hashSync } from "bcrypt";
import { IRegisterParam } from "../interfaces/auth.type";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function registerUser(params: IRegisterParam) {
  const existing = await findUserByEmail(params.email);
  if (existing) throw new Error("Email already registered");

  const salt = genSaltSync(10);
  const hashed = hashSync(params.password, salt);

  return prisma.user.create({
    data: {
      role: params.role,
      name: params.name,
      email: params.email,
      password: hashed,
    },
  });
}
