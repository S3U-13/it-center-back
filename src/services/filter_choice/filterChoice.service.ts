import dbPPK from "../../models/ppkhosp/index";
import db from "../../models/it-center";
import { Op } from "sequelize";

export class FilterChoiceService {
  static async Location(query: Record<string, any>) {
    const data = await dbPPK.Location.findAll({
      where: {
        locationtypeid: [10, 11, 20, 30, 40, 50, 55, 60, 65, 70, 75],
        active: "Y",
      },
    });
    const formatData = data.map((i: any) => ({
      id: i.id,
      name: i.detailtext,
    }));
    return formatData;
  }

  static async FuncUnit(query: Record<string, any>) {
    const data = await dbPPK.FuncUnit.findAll({
      where: {
        active: "Y",
      },
    });

    const formatData = data.map((i: any) => ({
      id: i.FuncUnitID,
      name: i.FuncUnitName,
    }));
    return formatData;
  }

  static async DispenseStatus(query: Record<string, any>) {
    const data = await db.DispenseStatus.findAll({
      attributes: ["id", "name"],
      where: {
        active: "Y",
      },
    });
    return data;
  }
  static async Payers(query: Record<string, any>) {
    const data = await dbPPK.AppPerson.findAll({
      where: {
        id: { [Op.in]: [2871, 4458, 6353, 6519, 7289, 7821] },
      },
      include: [{ model: dbPPK.AppUser, as: "User" }],
    });

    const formatData = data.map((i: any) => ({
      userid: i.User?.userid,
      personid: i.id,
      name: `${i.firstname} ${i.lastname}`,
    }));

    return formatData;
  }

  static async HardwareType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 1,
      },
    });
    return data;
  }
  static async Brand(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 2,
      },
    });
    return data;
  }
  static async Model(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 3,
      },
    });
    return data;
  }
  static async ScreenSizeDesktop(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 4,
      },
    });
    return data;
  }
  static async ScreenSizeTablet(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 5,
      },
    });
    return data;
  }
  static async Cpu(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 6,
      },
    });
    return data;
  }
  static async Ram(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 7,
      },
    });
    return data;
  }
  static async StorageType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 8,
      },
    });
    return data;
  }

  static async OperatingSystem(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 9,
      },
    });
    return data;
  }
  static async Gpu(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 10,
      },
    });
    return data;
  }
  static async GpuType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 11,
      },
    });
    return data;
  }
  static async TrueFalse(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 12,
      },
    });
    return data;
  }
  static async PrinterType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 13,
      },
    });
    return data;
  }
  static async Connection(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 14,
      },
    });
    return data;
  }
  static async UPSType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 15,
      },
    });
    return data;
  }
  static async Resolution(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 16,
      },
    });
    return data;
  }
  static async ScannerType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 17,
      },
    });
    return data;
  }
  static async OSVersion(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 18,
      },
    });
    return data;
  }
  static async MonitorType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 19,
      },
    });
    return data;
  }
  static async AdaptorType(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 20,
      },
    });
    return data;
  }
  static async StorageCapacity(query: any) {
    const data = await db.Categories.findAll({
      attributes: ["id", "name"],
      where: {
        flag_cancel: "N",
        type_id: 21,
      },
    });
    return data;
  }
}
