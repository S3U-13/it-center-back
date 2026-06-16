import { Request, Response } from "express";
import { HardwareService } from "../../services/hardware/hardware.service";

export class HardwareController {
  static async index(req: Request, res: Response) {
    try {
      const data = await HardwareService.AllInOneIndex(req.query);
      return res.status(200).json({ success: true, ...data });
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
  static async show(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const data = await HardwareService.HardwareShow(Number(id));
      return res.status(200).json({ message: "success", data });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  static async edit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await HardwareService.HardwareEdit(Number(id), req.body);
      return res.status(200).json({ message: "edit success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
