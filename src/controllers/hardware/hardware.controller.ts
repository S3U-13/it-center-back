import { Request, Response } from "express";
import { HardwareService } from "../../services/hardware/hardware.service";

export class HardwareController {
  static async index(req: Request, res: Response) {
    try {
      const data = await HardwareService.AllInOneIndex(req.query);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async create(req: Request, res: Response) {
    try {
      await HardwareService.HardwareCreate(req.body);
      return res.status(201).json({
        message: "success",
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
