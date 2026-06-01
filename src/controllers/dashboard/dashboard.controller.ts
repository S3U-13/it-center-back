import { Request, Response } from "express";
import { DashboardService } from "../../services/deshboard/dashboard.service";

export class DashboardController {
  static async DashboardSummary(req: Request, res: Response) {
    try {
      const data = await DashboardService.countEquipment(req.query);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
