import db from "../../models/it-center/index";
import { Op, fn, col } from "sequelize";

export class DashboardService {
  static async countEquipment(query: any) {
    const groupFields = ["hardware_type", "payer"];

    const rows = await db.Hardware.findAll({
      attributes: [
        [fn("COUNT", col("id")), "count"], // ตั้งชื่อ alias เป็น count เพื่อให้เรียกใช้ง่าย
        "hardware_type",
        "payer",
      ],
      group: groupFields,
      raw: true, // ใช้ raw: true เพื่อให้ได้ข้อมูลเป็น JSON Object ธรรมดา จัดการง่ายขึ้น
    });

    // 1. กำหนดค่าเริ่มต้นของตัวแปรนับจำนวนเป็น 0
    let aio = 0;
    let pc = 0;
    let desktop = 0;
    let mini_pc = 0;
    let monitor = 0;
    let printer = 0;
    let ups = 0;
    let tablet = 0;

    // 2. วนลูปเพื่อบวกเพิ่มค่าตาม hardware_type ที่ query ได้มา
    rows.forEach((row: any) => {
      const type = row.hardware_type; // แปลงเป็นตัวพิมพ์เล็กเพื่อป้องกันการผิดพลาด
      const count = parseInt(row.count, 10) || 0;

      if (type === 1) aio += count;
      else if (type === 2) desktop += count;
      else if (type === 3) mini_pc += count;
      else if (type === 4) pc += count;
      else if (type === 5) monitor += count;
      else if (type === 6) printer += count;
      else if (type === 7) ups += count;
      else if (type === 16) tablet += count;
    });

    // 3. คำนวณผลรวมตามเงื่อนไขเดิมของคุณ
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
      tablet,
    };
  }
}
