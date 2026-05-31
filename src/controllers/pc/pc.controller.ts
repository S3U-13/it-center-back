import { Request, Response } from "express";
import { PcService } from "../../services/pc/pc.service";

export class PcController {
  static async index(req: Request, res: Response) {
    try {
      const query = req.query;
      const data = await PcService.index(query);
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
      await PcService.create(req.body);
      return res.status(201).json({
        message: "success",
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = await PcService.show(Number(id));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await PcService.edit(Number(id), req.body);
      return res.status(200).json({ message: "edit success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await PcService.Delete(Number(id));
      return res.status(200).json({ success: true, message: "delete success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
