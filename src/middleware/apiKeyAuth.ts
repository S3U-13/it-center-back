import * as dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key is missing",
    });
  }
  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }
  next();
};
