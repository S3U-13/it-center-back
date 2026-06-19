import * as dotenv from "dotenv";
dotenv.config();
import dbUser from "../../models/user";
import dbPPK from "../../models/ppkhosp";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { hashPassword } from "../../utils/hashPassword";

export class AuthService {
  static async register(body: any) {
    const transaction = await dbUser.sequelize.transaction();

    try {
      let {
        userid,
        username,
        password,
        FuncUnitID,
        role_id,
        type_id,
        // doctorid,
      } = body;

      username = username?.trim().toLowerCase();
      password = password?.trim();

      if (!userid || !username || !password) {
        throw new Error("userid, username and password are required");
      }

      if (password.length < 8) {
        throw new Error("Password must be to least 8 characters");
      }

      const allowedRoles = [1, 2]; // 1 = user | 2 = admin
      if (!allowedRoles.includes(Number(role_id))) {
        throw new Error("Invalid role");
      }

      const allowedTypes = [3, 4, 5]; // 3 = staff | 4 = nurse | 5 = doctor
      if (!allowedTypes.includes(Number(type_id))) {
        throw new Error("Invalid type");
      }

      const funcUnit = await dbPPK.FuncUnit.findByPk(FuncUnitID);
      if (!funcUnit) {
        throw new Error("FuncUnit not found");
      }

      //   if (doctorid) {
      //     const doctor = await dbPPK.Doc
      //   }
      const existingUsername = await dbUser.Users.findOne({
        where: {
          username,
        },
        transaction,
      });

      if (existingUsername) {
        throw new Error("user already exists");
      }

      const hashedPassword = await hashPassword(password);

      const user = await dbUser.Users.create(
        {
          userid,
          username,
          password1: hashedPassword,
          // doctorid: doctorid || null,
        },
        {
          transaction,
        },
      );

      const user_access = await dbUser.UserAccess.create(
        {
          userid,
          FuncUnitID,
          type_id,
          role_id,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      return {
        id: user.id,
        userid: user.userid,
        username: user.username,
        FuncUnitID: user_access.FuncUnitID,
        role_id: user_access.role_id,
        type_id: user_access.type_id,
      };
    } catch (error: any) {
      await transaction.rollback();
      throw error;
    }
  }

  static async login(body: any) {
    let { username, password } = body;

    username = username?.trim().toLowerCase();
    password = password?.trim();

    if (!username || !password) {
      throw new Error("Username and Password are required!");
    }

    const user = await dbUser.Users.findOne({
      where: {
        username,
      },
      include: [
        {
          model: dbUser.UserAccess,
          as: "Access",
          attributes: ["userid", "type_id", "role_id", "FuncUnitID"],
        },
      ],
    });

    const userppk = await dbPPK.AppUser.findOne({
      where: {
        userid: user.userid,
      },
      attributes: ["userid", "personid"],
    });

    if (!user) {
      throw new Error("Invalid Username or Password");
    }

    const isMatch = await bcrypt.compare(password, user.password1);
    if (!isMatch) {
      throw new Error("Invalid Username or Password");
    }

    const token = jwt.sign(
      {
        id: user?.id,
        userid: user?.userid,
        username: user?.username,
        role_id: user?.Access?.role_id,
        FuncUnitID: user?.Access?.FuncUnitID,
        type_id: user?.Access?.type_id,
        personid: userppk.personid,
      },
      (process.env.JWT_SECRET || "secretkey") as string, // <--- เติม as string ครอบไว้ตรงนี้
      {
        expiresIn: (process.env.JWT_EXPIRES_IN || "12h") as any, // <--- เติม as any เพื่อป้องกัน TS สับสนเรื่องฟอร์แมตเวลา
      },
    );

    return {
      token,
      user: {
        id: user.id,
        userid: user.userid,
        username: user.username,
        role_id: user.Access.role_id,
        doctorid: user.doctorid,
        funcUnitID: user.Access.FuncUnitID,
        type_id: user.Access.type_id,
        personid: userppk.personid,
      },
    };
  }

  static async me(token: string) {
    if (!token) {
      throw new Error("No token");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey",
    ) as Decode.token;

    const person = await dbPPK.AppPerson.findOne({
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

      where: {
        id: decoded.personid,
      },

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

    const user = await dbUser.Users.findOne({
      where: {
        userid: decoded.userid,
      },
      include: [
        {
          model: dbUser.UserAccess,
          as: "Access",
          attributes: ["userid", "type_id", "role_id", "FuncUnitID"],
          include: [
            { model: dbUser.Options, as: "Type", attributes: ["name"] },
            { model: dbUser.Options, as: "Role", attributes: ["name"] },
          ],
        },
      ],
    });

    if (!person) {
      throw new Error("User not found");
    }

    return {
      salutation: person?.Salutation?.lookupname ?? "",

      firstname: person?.firstname ?? "",

      lastname: person?.lastname ?? "",

      username: user.username ?? "",

      funcUnit: person?.FuncUnitName?.FuncunitName ?? "",

      FuncUnitID: person?.FuncUnitID ?? null,

      role: user.Access.Role.name,

      role_id: user.Access.role_id,

      type: user.Access.Type.name,

      type_id: user.Access.type_id,

      userid: user.userid ?? null,

      doctorid: null,
    };
  }
}
