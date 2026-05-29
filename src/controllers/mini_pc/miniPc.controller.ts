import { Request, Response } from "express";
import { MiniPcService } from "../../services/mini_pc/miniPc.service";

export class MiniPcController {
  static async index(req: Request, res: Response) {
    try {
      const query = req.query;
      const data = await MiniPcService.index(query);
      return res.status(200).json({ success: true, ...data });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Internal Server Error",
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      await MiniPcService.create(req.body);
      return res.status(201).json({
        message: "success",
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.massage });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = await MiniPcService.show(Number(id));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.massage });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await MiniPcService.edit(Number(id), req.body);
      return res.status(200).json({ massage: "edit success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.massage });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await MiniPcService.Delete(Number(id));
      return res.status(200).json({ success: true, message: "delete success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
