import dbPPK from "../../models/ppkhosp";

export class SearchUserService {
  static async searchUser(cid: string) {
    if (!cid) {
      throw new Error("CID is required");
    }

    const person = await dbPPK.AppPerson.findOne({
      where: {
        FuncunitID: 12,
        StatusID: 1,
        CITIZEN: cid,
      },
      attributes: [
        "id",
        "salutation",
        "firstname",
        "lastname",
        "GroID",
        "OffID",
        "PosID",
        "FuncUnitID",
        "StatusID",
        "CITIZEN",
        "active",
      ],
      include: [
        {
          model: dbPPK.Lookup,
          as: "Salutation",
          attributes: ["lookupname"], // เปิดเพื่อเลือกเอาเฉพาะคอลัมน์ชื่อคำนำหน้า
          where: {
            lookuptypeid: 17,
          },
          required: false, // 💡 ใส่เพื่อป้องกันข้อมูลหาย หากพนักงานบางคนไม่ได้ระบุคำนำหน้าชื่อในเบส
        },
        {
          model: dbPPK.FuncUnit,
          as: "FuncUnitName",
          attributes: ["FuncunitName"],
          required: false,
        },
        {
          model: dbPPK.AppUser,
          as: "User",
          attributes: ["userid", "personid"],
          required: false,
          include: [
            {
              model: dbPPK.AppUsername,
              as: "Username",
              attributes: ["username"],
              required: false,
            },
          ],
        },
      ],
    });

    // 💡 ดักโครงสร้าง: ถ้าไม่เจอข้อมูลพนักงานในระบบ ให้แจ้งเตือนอย่างปลอดภัย ไม่ปล่อยให้โค้ดรันต่อไปพังด้านล่าง
    if (!person) {
      throw new Error("You are not IT staff or user not found");
    }

    // จัดฟอร์แมตข้อมูลส่งออกอย่างปลอดภัยด้วยเครื่องหมาย ?. ครบทุกตำแหน่ง
    const formatObject = {
      salutation: person?.Salutation?.lookupname ?? "",
      firstname: person?.firstname ?? "",
      lastname: person?.lastname ?? "",
      userid: person?.User?.userid ?? null,
      username: person?.User?.Username?.username ?? "",
      funcUnit: person?.FuncUnitName?.FuncunitName ?? "",
      funcUnitID: person?.FuncUnitID ?? null,
      type: "staff",
      type_id: 3,
      role: "admin",
      role_id: 2,
    };

    return formatObject;
  }
}
