import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// 💡 สร้าง Interface สำหรับข้อมูลที่อยู่ใน Token
interface UserPayload extends jwt.JwtPayload {
  id?: number;
  userid?: string;
  username?: string;
  role_id?: number | string;
  funcUnitID?: number | string;
  type_id?: number | string;
}

// 💡 ขยายประเภทข้อมูลของ Express Request เพื่อให้รู้จัก req.user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// 🔐 ตรวจสอบ token
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let token: string | null = null;

  const authHeader = req.headers["authorization"];

  // 👉 header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 👉 cookie
  if (!token && req.cookies) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      (process.env.JWT_SECRET || "secretkey") as string,
    ) as UserPayload;

    req.user = decoded;
    return next(); // เติม return เพื่อความปลอดภัยของ Flow โค้ด
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
}

// 🔑 ตรวจสอบ role
export function authorizeRole(...roles: (number | string)[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role_id === undefined || !roles.includes(req.user.role_id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    return next();
  };
}

// 🏢 ตรวจสอบ FuncUnit
export function authorizeFuncUnit(...FuncUnitIDs: (number | string)[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (
      req.user.funcUnitID === undefined ||
      !FuncUnitIDs.includes(req.user.funcUnitID)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    return next();
  };
}
