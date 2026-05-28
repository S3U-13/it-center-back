import db from "../../models/it-center/index";
import { Op } from "sequelize";

export class UpsService {
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

    const { rows, count } = await db.Ups.findAndCountAll({
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
    const { ups } = body;

    if (!ups || !Array.isArray(ups) || ups.length === 0) {
      throw new Error("Ups must be a non-empty array");
    }

    const requiredFields = ["sn", "rpj_no", "FuncUnitID", "status", "location"];

    //const map
    const mappingUps = ups.map((i, index) => {
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
        FuncUnitID: i.FuncUnitID || null,
        location: i.location || null,
        date: i.date || new Date(), // ถ้าไม่ส่งมา ให้ใช้วันที่ปัจจุบัน
        status: i.status ?? 2,
      };
    });
    return await db.Ups.bulkCreate(mappingUps);
  }
  static async show(id: number) {
    return await db.Ups.findByPk(id, {
      attributes: [
        "sn",
        "rpj_no",
        "note",
        "FuncUnitID",
        "location",
        "date",
        "status",
      ],
    });
  }

  static async edit(id: number, body: any) {
    const { sn, rpj_no, note, FuncUnitID, location, date, status } = body;

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

    const Ups = await db.Ups.findByPk(id);

    if (!Ups) {
      throw new Error("Ups not found");
    }

    await Ups.update(
      {
        sn,
        rpj_no,
        note,
        FuncUnitID,
        location,
        date,
        status,
      },
      { where: id },
    );
  }
}
