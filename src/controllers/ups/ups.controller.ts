import { Request, Response } from "express";
import { UpsService } from "../../services/ups/ups.service";

export class UpsController {
  static async index(req: Request, res: Response) {
    try {
      const query = req.query;
      const data = await UpsService.index(query);
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
      await UpsService.create(req.body);
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
      const data = await UpsService.show(Number(id));
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await UpsService.edit(Number(id), req.body);
      return res.status(200).json({ message: "edit success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await UpsService.Delete(Number(id));
      return res.status(200).json({ success: true, message: "delete success" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
