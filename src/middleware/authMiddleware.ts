import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

let cachedCentralPublicKey: string | null = null;

async function getCentralPublicKey(): Promise<string | null> {
  if (cachedCentralPublicKey) return cachedCentralPublicKey;

  if (process.env.JWT_PUBLIC_KEY) {
    cachedCentralPublicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");
    return cachedCentralPublicKey;
  }

  const keyPaths = [
    path.resolve(process.cwd(), "keys", "public.pem"),
    path.resolve(__dirname, "../../keys", "public.pem"),
    path.resolve(__dirname, "../../../auth-ppk-api/keys", "public.pem"),
  ];

  for (const kp of keyPaths) {
    if (fs.existsSync(kp)) {
      try {
        cachedCentralPublicKey = fs.readFileSync(kp, "utf8");
        return cachedCentralPublicKey;
      } catch {}
    }
  }

  const authUrl = process.env.CENTRAL_AUTH_URL || "http://localhost:3007";
  try {
    const res = await fetch(`${authUrl}/api/auth/public-key`);
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data?.publicKey) {
        cachedCentralPublicKey = data.publicKey;
        return cachedCentralPublicKey;
      }
    }
  } catch {}

  return null;
}

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
export async function authenticateToken(
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
    const decodedToken = jwt.decode(token, { complete: true }) as {
      header?: { alg?: string };
    } | null;
    const alg = decodedToken?.header?.alg;

    let decoded: UserPayload;

    if (alg === "RS256") {
      const publicKey = await getCentralPublicKey();
      if (!publicKey) {
        return res.status(500).json({ error: "Central auth public key not found" });
      }
      decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as UserPayload;
    } else {
      decoded = jwt.verify(
        token,
        (process.env.JWT_SECRET || "secretkey") as string,
        { algorithms: ["HS256"] }
      ) as UserPayload;
    }

    req.user = decoded;
    return next();
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
