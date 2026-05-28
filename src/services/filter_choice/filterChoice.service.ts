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
}
