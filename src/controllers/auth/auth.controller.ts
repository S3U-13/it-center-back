import { AuthService } from "../../services/auth/auth.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = await AuthService.register(req.body);
      
      return res.status(201).json({
        success: true,
        message: "Register successfully",
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = await AuthService.login(req.body);

      res.cookie("access_token", data.token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 12 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        success: true,
        message: "Login successfully",
        data: data.user,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    res.json({ success: true, message: "Logged out successfully" });
  }

  static async me(req: Request, res: Response) {
    try {
      const token = req.cookies?.access_token;

      const data = await AuthService.me(token);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(401).json({
        success: false,
        message: error.message || "Invalid token",
      });
    }
  }

  static async checkToken(req: Request, res: Response) {
    const token = req.cookies?.access_token; // 👈 เปลี่ยนตรงนี้
    if (!token) return res.status(401).json({ valid: false });

    jwt.verify(
      token,
      (process.env.JWT_SECRET || "secretkey") as any,
      (err: any, decoded: any) => {
        if (err) {
          // token หมดอายุหรือไม่ถูกต้อง
          return res.status(401).json({ valid: false, error: err.message });
        }
        // token valid
        res.json({ valid: true, user: decoded });
      },
    );
  }
}
