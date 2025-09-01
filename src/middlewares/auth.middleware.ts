import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/auth.types";

const SECRET_KEY = process.env.SECRET_KEY || "Rentago2025";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

// Middleware utama: token JWT
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new Error("Unauthorized");

    const verifyToken = jwt.verify(token, SECRET_KEY) as IJwtPayload;

    if (!verifyToken) throw new Error("Invalid token");

    req.user = verifyToken;
    next();
  } catch (error) {
    next(error);
  }
}

// Middleware khusus role: Tenant
export function tenantGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role !== "TENANT") {
      throw new Error("Forbidden: Tenant only");
    }
    next();
  } catch (error) {
    next(error);
  }
}

// Middleware khusus role: User
export function userGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role !== "USER") {
      throw new Error("Forbidden: User only");
    }
    next();
  } catch (error) {
    next(error);
  }
}
