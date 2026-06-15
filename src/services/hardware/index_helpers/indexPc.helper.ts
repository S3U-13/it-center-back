import db from "../../../models/it-center";
import dbPPK from "../../../models/ppkhosp/index";
import { Op } from "sequelize";

export async function Pc(query: Hardware.queryIndexType) {
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const offset = (page - 1) * limit;

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

  const where_location: any = {};

  // 1. แก้ไขปีกกาเกินจาก turn ที่แล้ว
  if (search) {
    where.sn = { [Op.like]: `%${search}%` };
  }
  if (dispense_status) where.dispense_status = Number(dispense_status);
  if (location) where_location.location = Number(location);
  if (FuncUnitID) where_location.FuncUnitID = Number(FuncUnitID);

  if (start_date && end_date) {
    where.createdAt = { [Op.between]: [start_date, end_date] };
  } else if (start_date) {
    where.createdAt = { [Op.gte]: start_date };
  } else if (end_date) {
    where.createdAt = { [Op.lte]: end_date };
  }

  if (pay_date) where.pay_date = Number(pay_date);
  if (payer) where.payer = Number(payer);
  if (hardware_type) where.hardware_type = Number(hardware_type);

  // ดึงข้อมูลหลักจากฐานข้อมูล it-center
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
        where: { ...where_location },
      },
      { model: db.DispenseStatus, attributes: ["id", "name"] },
    ],
    limit,
    offset,
    raw: false, // มั่นใจว่าได้ Instance Object ของ Sequelize
  });

  // แปลง Sequelize Instance ให้กลายเป็น Plain Object เพื่อให้อ่านค่า properties ง่ายและชัวร์ที่สุด
  const plainRows = rows.map((row: any) => row.get({ plain: true }));

  // 2. รวบรวม ID ทั้งหมดไปคิวรีรอบเดียว (แก้ปัญหา N+1 และแก้บั๊กหาตัวแปรไม่เจอ)
  const locationIds = Array.from(
    new Set(plainRows.map((r: any) => r.Locations?.location).filter(Boolean)),
  );
  const funcUnitIds = Array.from(
    new Set(plainRows.map((r: any) => r.Locations?.FuncUnitID).filter(Boolean)),
  );

  // ดึงข้อมูลจากฐานข้อมูลโรงพยาบาล (ppkhosp) มารอไว้ในหน่วยความจำ
  const [ppkLocations, ppkFuncUnits] = await Promise.all([
    locationIds.length
      ? dbPPK.Location.findAll({ where: { id: { [Op.in]: locationIds } } })
      : [],
    funcUnitIds.length
      ? dbPPK.FuncUnit.findAll({
          where: { FuncUnitID: { [Op.in]: funcUnitIds } },
        })
      : [],
  ]);

  // เปลี่ยนอาเรย์เป็น Map เพื่อดึงข้อมูลออกไปใช้ได้ด้วยความเร็ว O(1)
  const locationMap = new Map(
    ppkLocations.map((l: any) => [String(l.id), l.detailtext]),
  );
  const funcUnitMap = new Map(
    ppkFuncUnits.map((f: any) => [String(f.FuncUnitID), f.FuncUnitName]),
  );

  // 3. จัดโครงสร้างผลลัพธ์ (ไม่ต้องใช้ await ใน map อีกต่อไป)
  const formatData = plainRows.map((row: any) => {
    const locId = row.Locations?.location ? String(row.Locations.location) : "";
    const funcId = row.Locations?.FuncUnitID
      ? String(row.Locations.FuncUnitID)
      : "";

    return {
      id: row.id,
      sn: row.sn,
      service_tag: row.Identifiers.service_tag,
      main_asset_number: row.Identifiers.main_asset_number,
      express_code: row.Identifiers.express_code,
      rpj_no: row.rpj_no,
      note: row.note,
      pay_date: row.pay_date,
      machine_name: row.machine_name,
      hardware_type: row.hardware_type,
      payer: row.payer,
      location: locationMap.get(locId) || "ไม่ระบุ",
      FuncUnit: funcUnitMap.get(funcId) || "ไม่ระบุ",
      dispense_status: row.dispense_status,
      dispense_status_name: row.DispenseStatus
        ? row.DispenseStatus.name
        : "ไม่ระบุ",
    };
  });

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
