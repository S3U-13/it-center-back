import { machine } from "node:os";
import db from "../../models/it-center/index";
import dbPPK from "../../models/ppkhosp/index";
import { Op } from "sequelize";

export class AllInOneService {
  static async index(query: Record<string, any>) {
    const page = parseInt(query?.page || 1);
    const limit = parseInt(query?.limit || 10);
    const offset = (page - 1) * limit;

    const {
      search,
      dispense_status_id,
      location_id,
      func_unit_id,
      start_date,
      end_date,
    } = query;
    const where: any = {};

    // 1. ค้นหาจากเลข SN (โค้ดเดิมของคุณ)
    if (search) {
      where.sn = {
        [Op.like]: `%${search}%`,
      };
    }

    // 2. ค้นหาจาก IDs ต่างๆ (ถ้าส่งมาและไม่เป็นค่าว่าง)
    if (dispense_status_id) {
      where.dispense_status = dispense_status_id;
    }

    if (location_id) {
      where.location = location_id;
    }

    if (func_unit_id) {
      where.FuncUnitID = func_unit_id;
    }

    // 3. ค้นหาแบบช่วงวันที่ (Date Range) ด้วย Op.between
    if (start_date && end_date) {
      where.createdAt = {
        // เปลี่ยนเป็นชื่อคอลัมน์วันที่ใน Database ของคุณ (เช่น date, createdAt)
        [Op.between]: [start_date, end_date],
      };
    } else if (start_date) {
      where.createdAt = {
        [Op.gte]: start_date, // ตั้งแต่วันที่เริ่ม
      };
    } else if (end_date) {
      where.createdAt = {
        [Op.lte]: end_date, // จนถึงวันที่สิ้นสุด
      };
    }

    const { rows, count } = await db.AllInOne.findAndCountAll({
      where,
      include: [{ model: db.DispenseStatus, attributes: ["id", "name"] }],
      limit,
      offset,
    });

    // 2. ใช้ Promise.all ควบคู่กับ .map เพื่อวิ่งไปค้นหาข้อมูลจากฐานข้อมูล PPK ของทุกแถวพร้อมกัน
    const formatData = await Promise.all(
      rows.map(async (row: any) => {
        // ค้นหา Location และ FuncUnit ของแถวปัจจุบัน (ระบุชื่อ Model ให้ถูกต้อง เช่น .Location และ .FuncUnit)
        const [location, func_unit] = await Promise.all([
          dbPPK.Location.findOne({ where: { id: row.location } }), // 🎯 จุดที่ 1: ระบุ Model และใช้ค่าจากรายแถว (row)
          dbPPK.FuncUnit.findOne({ where: { FuncUnitID: row.FuncUnitID } }), // 🎯 จุดที่ 1: ระบุ Model และใช้ค่าจากรายแถว (row)
        ]);

        // จัดฟอร์แมตข้อมูลส่งกลับไปสะสมใน Array (ระบุเผื่อกรณีไม่มีข้อมูลในฐานข้อมูลย่อยด้วย)
        return {
          id: row.id,
          service_tag: row.service_tag,
          express_code: row.express_code,
          sn: row.sn,
          rpj_no: row.rpj_no,
          purchase_price: row.purchase_price,
          salvage_value: row.salvage_value,
          purchase_date: row.purchase_date,
          receive_date: row.receive_date,
          warranty_start: row.warranty_start,
          warranty_end: row.warranty_end,
          main_asset_number: row.main_asset_number,
          note: row.note,
          keyboard: row.keyboard,
          mouse: row.mouse,
          adapter: row.adapter,
          adapter_type: row.adapter_type,
          machineName: row.machineName,
          location: location ? location.detailtext : "ไม่ระบุ", // ป้องกันระบบแครชหากหาตำแหน่งไม่เจอ
          FuncUnit: func_unit ? func_unit.FuncUnitName : "ไม่ระบุ", // ป้องกันระบบแครชหากหาชื่อกลุ่มงานไม่เจอ
          pay_date: row.pay_date,
          dispense_status: row.dispense_status,
          dispense_status_name: row.DispenseStatus
            ? row.DispenseStatus.name
            : "ไม่ระบุ",
        };
      }),
    );

    return {
      data: formatData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  static async create(body: any) {
    const { array_data } = body;

    if (
      !array_data ||
      !Array.isArray(array_data) ||
      array_data.length === 0
    ) {
      throw new Error("All In One must be a non-empty array");
    }

    const requiredFields = [
      "express_code",
      "rpj_no",
      "sn",
      "FuncUnitID",
      "location",
    ];

    //const map
    const mappingAllInOne = array_data.map((i, index) => {
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
        service_tag: i.service_tag,
        express_code: i.express_code,
        sn: i.sn,
        rpj_no: i.rpj_no || null, // ถ้าว่าง ให้บันทึกเป็น null ลง db ไม่พัง
        purchase_price: i.purchase_price,
        salvage_value: i.salvage_value,
        purchase_date: i.purchase_date,
        receive_date: i.receive_date,
        warranty_start: i.warranty_start,
        warranty_end: i.warranty_end,
        main_asset_number: i.main_asset_number || null,
        note: i.note || "", // ถ้าว่าง ให้เป็นสตริงเปล่า
        keyboard: i.keyboard || null,
        mouse: i.mouse || null,
        adapter: i.adapter || null,
        adapter_type: i.adapter_type || null,
        machineName: i.machineName || null,
        FuncUnitID: parseInt(i.FuncUnitID) || null,
        location: parseInt(i.location) || null,
        pay_date: i.pay_date || null, // new Date(), // ถ้าไม่ส่งมา ให้ใช้วันที่ปัจจุบัน
        payer: i.payer,
        dispense_status: i?.dispense_status || 2,
      };
    });
    return await db.AllInOne.bulkCreate(mappingAllInOne);
  }
  static async show(id: number) {
    return await db.AllInOne.findByPk(id, {
      // attributes: [
      //   "service_tag",
      //   "express_code",
      //   "sn",
      //   "rpj_no",
      //   "purchase_price",
      //   "salvage_value",
      //   "purchase_date",
      //   "receive_date",
      //   "warranty_start",
      //   "warranty_end",
      //   "main_asset_number",
      //   "note",
      //   "keyboard",
      //   "mouse",
      //   "adapter",
      //   "adapter_type",
      //   "machineName",
      //   "FuncUnitID",
      //   "location",
      //   "pay_date",
      //   "dispense_status",
      // ],
    });
  }

  static async edit(id: number, body: any) {
    const {
      service_tag,
      express_code,
      sn,
      rpj_no,
      purchase_price,
      salvage_value,
      purchase_date,
      receive_date,
      warranty_start,
      warranty_end,
      main_asset_number,
      note,
      keyboard,
      mouse,
      adapter,
      adapter_type,
      machineName,
      FuncUnitID,
      location,
      pay_date,
      payer,
      dispense_status,
    } = body;

    const requiredFields = [
      "service_tag",
      "express_code",
      "sn",
      "FuncUnitID",
      "dispense_status",
      "location",
    ];

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

    const aio = await db.AllInOne.findByPk(id);

    if (!aio) {
      throw new Error("All in one not found");
    }

    await aio.update(
      {
        service_tag,
        express_code,
        sn,
        rpj_no,
        purchase_price,
        salvage_value,
        purchase_date,
        receive_date,
        warranty_start,
        warranty_end,
        main_asset_number,
        note,
        keyboard,
        mouse,
        adapter,
        adapter_type,
        machineName,
        FuncUnitID,
        location,
        pay_date,
        payer,
        dispense_status,
      },
      { where: id },
    );
  }
  
  static async Delete(id: number) {
    await db.AllInOne.destroy({
      where: { id: id }, // ลบแถวที่มี id ตรงกับที่ส่งมาทันที
    });
  }
}
