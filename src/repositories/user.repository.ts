import prisma from "../lib/prisma";
import { cloudinaryUpload } from "../utils/cloudinary";
import { ICreateUserParam, IUpdateUserParam } from "../interfaces/user.types";
import { genSaltSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import mailer  from "../utils/nodemailer";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createUser(token: string, password: string) {
  const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
    email: string;
    name: string;
    role: "USER" | "TENANT";
  };

  const salt = genSaltSync(10);
  const hashed = hashSync(password, salt);

  return prisma.user.create({
    data: {
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      password: hashed,
      isVerified: true,
    },
  });
}

// export async function updateUser(
//   id: string,
//   params: IUpdateUserParam,
//   file?: Express.Multer.File
// ) {
//   if (params.password) {
//     const salt = genSaltSync(10);
//     params.password = hashSync(params.password, salt);
//   }

//   let profilePictureUrl: string | null = null;

//   if (file) {
//     const uploaded = await cloudinaryUpload(file);
//     profilePictureUrl = uploaded.secure_url;
//   } else if (
//     params.profilePicture &&
//     typeof params.profilePicture !== "string"
//   ) {
//     const uploaded = await cloudinaryUpload(params.profilePicture);
//     profilePictureUrl = uploaded.secure_url;
//   } else if (typeof params.profilePicture === "string") {
//     profilePictureUrl = params.profilePicture;
//   }

//   return prisma.user.update({
//     where: { id },
//     data: {
//       ...params,
//       profilePicture: profilePictureUrl,
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       profilePicture: true,
//       isVerified: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
// }

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
