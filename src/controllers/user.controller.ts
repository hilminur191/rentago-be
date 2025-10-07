import { Request, Response } from "express";
import * as userRepo from "../repositories/user.repository";
import prisma from "../lib/prisma";

// Get all users
export async function getAllUsersController(req: Request, res: Response) {
  try {
    const users = await userRepo.getAllUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// Get user by id
export async function getUserByIdController(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const user = await userRepo.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// Create user after email verification
export async function createUserController(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    const createdUser = await userRepo.createUser(token, password);
    return res.status(201).json(createdUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

// Update user
// export async function updateUserController(
//   req: Request<{ id: string }>,
//   res: Response
// ) {
//   try {
//     const updatedUser = await userRepo.updateUser(req.params.id, req.body);
//     return res.status(200).json(updatedUser);
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// }

// Delete user
export async function deleteUserController(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    await userRepo.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

// User details (pakai JWT middleware)
export async function getUserDetailController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
