import db from "../../models/it-center/index";
import { Op } from "sequelize";

export class DashboardService {
  static async countEquipment(query: any) {
    const [aio, pc, desktop, mini_pc, monitor, printer, ups] =
      await Promise.all([
        db.AllInOne.count(),
        db.Pc.count(),
        db.Desktop.count(),
        db.MiniPc.count(),
        db.Monitor.count(),
        db.Printer.count(),
        db.Ups.count(),
      ]);

    const sum_aio_pc_desk_top_mini_pc = aio + pc + desktop + mini_pc;
    return {
      total_devices: sum_aio_pc_desk_top_mini_pc,
      aio,
      pc,
      desktop,
      mini_pc,
      monitor,
      printer,
      ups,
    };
  }
}
