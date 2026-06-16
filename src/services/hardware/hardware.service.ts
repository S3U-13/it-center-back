import db from "../../models/it-center/index";
// index
import { AllInOne } from "./index_helpers/indexAllInOne.helper";
import { Desktop } from "./index_helpers/indexDesktop.helper";
import { MiniPc } from "./index_helpers/indexMiniPc.helper";
import { Pc } from "./index_helpers/indexPc.helper";
import { Monitor } from "./index_helpers/indexMonitor.helper";
import { Printer } from "./index_helpers/indexPrinter.helper";
import { UPS } from "./index_helpers/indexUPS.helper";
import { Tablet } from "./index_helpers/indexTablet.helper";
// create
import { CreateAllInOne } from "./create_helpers/createAllInOne.helper";
import { CreateDesktop } from "./create_helpers/createDesktop.helper";
import { CreateMiniPc } from "./create_helpers/createMiniPc.helper";
import { CreatePc } from "./create_helpers/createPc.helper";
import { CreateMonitor } from "./create_helpers/createMonitor.helper";
import { CreatePrinter } from "./create_helpers/createPrinter.helper";
import { CreateUPS } from "./create_helpers/createUPS.helper";
import { CreateTablet } from "./create_helpers/createTablet.helper";
// show
import { ShowAllInOne } from "./show_helpers/showAllInOne.helper";
import { ShowDesktop } from "./show_helpers/showDesktop.helper";
import { ShowMiniPc } from "./show_helpers/showMiniPc.helper";
import { ShowPc } from "./show_helpers/showPc.helper";
import { ShowMonitor } from "./show_helpers/showMonitor.helper";
import { ShowPrinter } from "./show_helpers/showPrinter.helper";
import { ShowUPS } from "./show_helpers/showUPS.helper";
import { ShowTablet } from "./show_helpers/showTablet.helper";
// edit
import { EditAllInOne } from "./edit_helpers/editAllInOne.helper";
import { EditDesktop } from "./edit_helpers/editDesktop.helper";
import { EditMiniPc } from "./edit_helpers/editMiniPc.helper";
import { EditPc } from "./edit_helpers/editPc.helper";
import { EditMonitor } from "./edit_helpers/editMonitor.helper";
import { EditPrinter } from "./edit_helpers/editPrinter.helper";
import { EditUPS } from "./edit_helpers/editUPS.helper";
import { EditTablet } from "./edit_helpers/editTablet.helper";

export class HardwareService {
  static async AllInOneIndex(query: Hardware.queryIndexType) {
    const { hardware_type } = query;
    // console.log(hardware_type);
    switch (Number(hardware_type)) {
      case 1:
        return await AllInOne(query);
      case 2:
        return await Desktop(query);
      case 3:
        return await MiniPc(query);
      case 4:
        return await Pc(query);
      case 5:
        return await Monitor(query);
      case 6:
        return await Printer(query);
      case 7:
        return await UPS(query);
      case 16:
        return await Tablet(query);
      default:
        return {
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
    }
  }

  static async HardwareCreate(body: any) {
    const t = await db.sequelize.transaction();
    try {
      const { hardware_type, array_data } = body;

      // console.log(hardware_type);
      // console.log(array_data);

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
          payer: i.payer || null,
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
        case 16:
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

  static async HardwareShow(id: number) {
    const data = await db.Hardware.findOne({
      where: { id },
      attributes: ["id", "hardware_type"],
    });
    if (!data) {
      throw new Error("not found hardware");
    }
    const hardware_type = data.hardware_type;
    switch (hardware_type) {
      case 1:
        return await ShowAllInOne(id);
      case 2:
        return await ShowDesktop(id);
      case 3:
        return await ShowMiniPc(id);
      case 4:
        return await ShowPc(id);
      case 5:
        return await ShowMonitor(id);
      case 6:
        return await ShowPrinter(id);
      case 7:
        return await ShowUPS(id);
      case 16:
        return await ShowTablet(id);
      default:
        return null;
    }
  }
  static async HardwareEdit(id: number, body: any) {
    const t = await db.sequelize.transaction();
    try {
      const {
        hardware_type,
        sn,
        rpj_no,
        machine_name,
        note,
        payer,
        pay_date,
        dispense_status,
      } = body;

      await db.Hardware.update(
        {
          sn: sn,
          rpj_no: rpj_no,
          machine_name: machine_name,
          note: note,
          payer: payer,
          pay_date: pay_date,
          dispense_status: dispense_status,
        },
        { where: { id }, transaction: t },
      );
      switch (hardware_type) {
        case 1:
          await EditAllInOne(id, body, t);
          break;
        case 2:
          await EditDesktop(id, body, t);
          break;
        case 3:
          await EditMiniPc(id, body, t);
          break;
        case 4:
          await EditPc(id, body, t);
          break;
        case 5:
          await EditMonitor(id, body, t);
          break;
        case 6:
          await EditPrinter(id, body, t);
          break;
        case 7:
          await EditUPS(id, body, t);
          break;
        case 16:
          await EditTablet(id, body, t);
          break;

        default:
          break;
      }
      await t.commit();
      return { success: true };
    } catch (error: any) {
      await t.rollback();
      console.error("HardwareEdit Error:", error);
      throw error; // throw ออกไปให้ Controller จัดการต่อ
    }
  }
}
