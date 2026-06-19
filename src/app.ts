// app.ts
import * as dotenv from "dotenv";
dotenv.config(); // โหลดตั้งแต่วันแรกที่เปิดเซิร์ฟเวอร์

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";
import publicRoutes from "./routes/public.route";
import { apiKeyAuth } from "./middleware/apiKeyAuth";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api/user", apiKeyAuth, userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

export default app;
