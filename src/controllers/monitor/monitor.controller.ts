import { Request, Response } from "express";
import { MonitorService } from "../../services/monitor/monitor.service";

export class MonitorController {
  static async index(req: Request, res: Response) {
    try {
      const query = req.query;
      const data = await MonitorService.index(query);
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
      await MonitorService.create(req.body);
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
      const data = await MonitorService.show(Number(id));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.massage });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await MonitorService.edit(Number(id), req.body);
      return res.status(200).json({ massage: "edit success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.massage });
    }
  }
}
