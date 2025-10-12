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

// ✅ Middleware utama: verifikasi JWT
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as IJwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

// ✅ Middleware khusus role: Tenant
export function tenantGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "TENANT") {
    return res.status(403).json({ error: "Forbidden: Tenant only" });
  }
  next();
}

// ✅ Middleware khusus role: User
export function userGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "USER") {
    return res.status(403).json({ error: "Forbidden: User only" });
  }
  next();
}
