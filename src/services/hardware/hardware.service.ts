import db from "../../models/it-center/index";
import dbPPK from "../../models/ppkhosp/index";
import { Op, Transaction } from "sequelize";
import { CreateAllInOne } from "./create_helpers/createAllInOne.helper";
import { CreateDesktop } from "./create_helpers/createDesktop.helper";
import { CreateMiniPc } from "./create_helpers/createMiniPc.helper";
import { CreatePc } from "./create_helpers/createPc.helper";
import { CreateMonitor } from "./create_helpers/createMonitor.helper";
import { CreatePrinter } from "./create_helpers/createPrinter.helper";
import { CreateUPS } from "./create_helpers/createUPS.helper";
import { CreateTablet } from "./create_helpers/createTablet.helper";

export class HardwareService {
  static async AllInOneIndex(query: Hardware.queryIndexType) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const offset = (Number(page) - 1) * Number(limit);

    const {
      search,
      dispense_status,
      location,
      FuncUnitID,
      start_date,
      end_date,
      pay_date,
      payer,
      hardware_type,
    } = query;

    const where: any = {};
    if (search) {
      where.sn = {
        [Op.like]: `%${search}%}`,
      };
    }

    if (dispense_status) {
      where.dispense_status = dispense_status;
    }

    if (location) {
      where.location = location;
    }

    if (FuncUnitID) {
      where.FuncUnitID = FuncUnitID;
    }

    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [start_date, end_date],
      };
    } else if (start_date) {
      where.createdAt = {
        [Op.gte]: start_date,
      };
    } else if (end_date) {
      where.createdAt = {
        [Op.lte]: end_date,
      };
    }

    if (pay_date) {
      where.pay_date = pay_date;
    }

    if (payer) {
      where.payer = payer;
    }

    if (hardware_type) {
      where.hardware_type = hardware_type;
    }

    const { rows, count } = await db.Hardware.findAndCountAll({
      where,
      include: [
        {
          model: db.HardwareLocations,
          attributes: [
            "FuncUnitID",
            "location",
            "person_in_charge",
            "contact_number",
          ],
          as: "Locations",
        },
        { model: db.DispenseStatus, attributes: ["id", "name"] },
      ],
      limit,
      offset,
    });

    const formatData = await Promise.all(
      rows.map(async (row: any) => {
        const [location, func_unit] = await Promise.all([
          dbPPK.Location.findOne({ where: { id: row.Locations.location } }),
          dbPPK.FuncUnit.findOne({ where: { id: row.Locations.FuncUnitID } }),
        ]);

        return {
          id: row.id,
          sn: row.sn,
          rpj_no: row.rpj_no,
          note: row.note,
          pay_date: row.pay_date,
          machine_name: row.machine_name,
          hardware_type: row.hardware_type,
          payer: row.payer,
          location: location ? location.detailtext : "ไม่ระบุ", // ป้องกันระบบแครชหากหาตำแหน่งไม่เจอ
          FuncUnit: func_unit ? func_unit.FuncUnitName : "ไม่ระบุ", // ป้องกันระบบแครชหากหาชื่อกลุ่มงานไม่เจอ
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
        totalPages: Math.ceil(count / Number(limit)),
      },
    };
  }

  static async HardwareCreate(body: any) {
    const t = await db.sequelize.transaction();
    try {
      const { hardware_type, array_data } = body;

      console.log(hardware_type);
      console.log(array_data);

      if (
        !array_data ||
        !Array.isArray(array_data) ||
        array_data.length === 0
      ) {
        throw new Error("Hardware must be a non-empty array");
      }

      const requiredFields = [
        "express_code",
        "rpj_no",
        "sn",
        "FuncUnitID",
        "location",
      ];

      const mapHardware = array_data.map((i, index) => {
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
          rpj_no: i.rpj_no || null,
          machine_name: i.machine_name,
          note: i.note || null,
          pay_date: i.pay_date,
          hardware_type: hardware_type,
          dispense_status: i.dispense_status,
        };
      });

      const hardware = await db.Hardware.bulkCreate(mapHardware, {
        transaction: t,
      });

      switch (hardware_type) {
        case 1:
          await CreateAllInOne(array_data, hardware, t);
          break;
        case 2:
          await CreateDesktop(array_data, hardware, t);
          break;
        case 3:
          await CreateMiniPc(array_data, hardware, t);
          break;
        case 4:
          await CreatePc(array_data, hardware, t);
          break;
        case 5:
          await CreateMonitor(array_data, hardware, t);
          break;
        case 6:
          await CreatePrinter(array_data, hardware, t);
          break;
        case 7:
          await CreateUPS(array_data, hardware, t);
          break;
        case 8:
          await CreateTablet(array_data, hardware, t);
          break;

        default:
          break;
      }
      await t.commit();
      return { success: true };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
