import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  createUserAfterVerify,
  checkVerifyToken,
  requestResetPassword,
  confirmResetPassword,
} from "../repositories/auth.repository";
import { ILoginParam } from "../interfaces/auth.types";

// LOGIN
export async function loginUserController(req: Request, res: Response) {
  try {
    const { email, password }: ILoginParam = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

// REGISTER
export async function registerEmailController(req: Request, res: Response) {
  try {
    const { email, role, name } = req.body;
    const result = await registerUser({ email, role, name });
    return res.status(201).json(result);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

// VERIFY EMAIL TOKEN
export async function verifyEmailTokenController(req: Request, res: Response) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const result = await checkVerifyToken(token as string);
    if (!result)
      return res.status(400).json({ message: "Invalid or expired token" });
    return res.status(200).json({ message: "Token valid" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

// SET PASSWORD (verify email)
export async function setPasswordController(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    const result = await createUserAfterVerify(token, password);
    return res.status(201).json({ message: "User created", user: result });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

// RESET PASSWORD (request link)
export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await requestResetPassword(email);
    return res.status(200).json(result);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

// CONFIRM RESET PASSWORD
export async function confirmResetPasswordController(
  req: Request,
  res: Response
) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    const result = await confirmResetPassword(token, password);
    return res.status(200).json(result);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}
