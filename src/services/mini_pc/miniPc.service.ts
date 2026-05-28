import db from "../../models/it-center/index";
import { Op } from "sequelize";

export class MiniPcService {
  static async index(query: Record<string, any>) {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const offset = (page - 1) * limit;
    const { search } = query;
    const where: any = {};

    if (search) {
      where.sn = {
        [Op.like]: `%${search}%`,
      };
    }
    const { rows, count } = await db.MiniPc.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  static async create(body: any) {
    const { mini_pcs } = body;

    if (!mini_pcs || !Array.isArray(mini_pcs) || mini_pcs.length === 0) {
      throw new Error("MiniPc must be a non-empty array");
    }

    const requiredFields = ["sn", "rpj_no", "FuncUnitID", "status", "location"];

    //const map
    const mappingMiniPc = mini_pcs.map((i, index) => {
      if (!i) {
        throw new Error(`Item at index ${index} cannot be null or undefined`);
      }
      for (const field of requiredFields) {
        if (i[field] === undefined || i[field] === null || i[field] === "") {
          throw new Error(
            `Item at index ${index} is missing a required field: '${field}'`,
          );
        }
      }
      return {
        sn: i.sn,
        rpj_no: i.rpj_no || null, // ถ้าว่าง ให้บันทึกเป็น null ลง db ไม่พัง
        note: i.note || "", // ถ้าว่าง ให้เป็นสตริงเปล่า
        keyboard: i.keyboard || null,
        mouse: i.mouse || null,
        adapter: i.adapter || null,
        adapter_typ: i.adapter_typ || null,
        machineName: i.machineName || null,
        FuncUnitID: i.FuncUnitID,
        location: i.location || null,
        date: i.date || new Date(), // ถ้าไม่ส่งมา ให้ใช้วันที่ปัจจุบัน
        status: i.status ?? 2,
      };
    });
    return await db.MiniPc.bulkCreate(mappingMiniPc);
  }
  static async show(id: number) {
    return await db.MiniPc.findByPk(id, {
      attributes: [
        "sn",
        "rpj_no",

        "note",
        "keyboard",
        "mouse",
        "adapter",
        "adapter_typ",
        "machineName",
        "FuncUnitID",
        "location",
        "date",
        "status",
      ],
    });
  }

  static async edit(id: number, body: any) {
    const {
      sn,
      rpj_no,
      note,
      keyboard,
      mouse,
      adapter,
      adapter_typ,
      machineName,
      FuncUnitID,
      location,
      date,
      status,
    } = body;

    const requiredFields = ["sn", "rpj_no", "FuncUnitID", "status", "location"];

    // 1. แก้ไขการตรวจสอบค่าว่าง: ดึงค่าจาก body[field] มาเช็คจริง ๆ
    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        throw new Error(`Item is missing a required field: '${field}'`);
      }
    }

    const MiniPc = await db.MiniPc.findByPk(id);

    if (!MiniPc) {
      throw new Error("MiniPc not found");
    }

    await MiniPc.update(
      {
        sn,
        rpj_no,
        note,
        keyboard,
        mouse,
        adapter,
        adapter_typ,
        machineName,
        FuncUnitID,
        location,
        date,
        status,
      },
      { where: id },
    );
  }
}
