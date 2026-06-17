import db from "../../../models/it-center/index";
import { Transaction } from "sequelize";
export async function CreateTablet(
  array_data: any,
  hardware: any,
  t: Transaction,
) {
  const mapLocation = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    FuncUnitID: i.FuncUnitID,
    location: i.location,
    person_in_charge: i.person_in_charge,
    contact_number: i.contact_number,
  }));

  const mapPurchase = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    purchase_price: i.purchase_price,
    salvage_value: i.salvage_value,
    purchase_date: i.purchase_date || null,
    receive_date: i.receive_date || null,
    warranty_start: i.warranty_start || null,
    warranty_end: i.warranty_end || null,
  }));

  const mapBrands = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    brand: i.brand,
    model: i.model,
  }));

  const mapTabletDetails = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    screening_size: i.screening_size,
    imei_no: i.imei_no,
    storage: i.storage,
    operating_system: i.operating_system,
    os_version: i.os_version,
    mac_address_wifi: i.mac_address_wifi,
    mac_address_bluetooth: i.mac_address_bluetooth,
    pen_status: i.pen_status,
  }));

  // 🟢 แก้ไขตรงนี้: เปลี่ยนจาก { t } เป็น { transaction: t }
  return await Promise.all([
    await db.HardwareLocations.bulkCreate(mapLocation, { transaction: t }),
    await db.HardwarePurchases.bulkCreate(mapPurchase, { transaction: t }),
    await db.HardwareBrands.bulkCreate(mapBrands, { transaction: t }),
    await db.HardwareTabletDetails.bulkCreate(mapTabletDetails, {
      transaction: t,
    }),
  ]);
}
