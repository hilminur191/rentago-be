import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail, registerUser } from "../repositories/auth.repository";
import { ILoginParam, IRegisterParam } from "../interfaces/auth.type";

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password }: ILoginParam = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    // cek password (kalau social login, password bisa null)
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "This account uses social login" });
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

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

export async function registerNewUser(req: Request, res: Response) {
  try {
    const userData: IRegisterParam = req.body;

    const user = await registerUser({
      ...userData,
    });

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err: any) {
    return res
      .status(400)
      .json({ message: err.message || "Registration failed" });
  }
}
