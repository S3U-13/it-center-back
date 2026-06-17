import db from "../../../models/it-center";
import { Transaction } from "sequelize";

export async function EditTablet(id: Number, body: any, t: Transaction) {
  const {
    // location
    FuncUnitID,
    location,
    person_in_charge,
    contact_number,
    // purchase
    purchase_price,
    salvage_value,
    purchase_date,
    receive_date,
    warranty_start,
    warranty_end,
    // brands
    brand,
    model,
    // tablet
    screening_size,
    imei_no,
    storage,
    operating_system,
    mac_address_wifi,
    mac_address_bluetooth,
    pen_status,
  } = body;
  return await Promise.all([
    db.HardwareLocations.update(
      { FuncUnitID, location, person_in_charge, contact_number },
      { where: { hardware_id: id }, transaction: t }, // รวมในอ็อบเจกต์เดียวกัน
    ),
    db.HardwarePurchases.update(
      {
        purchase_price,
        salvage_value,
        purchase_date,
        receive_date,
        warranty_start,
        warranty_end,
      },
      { where: { hardware_id: id }, transaction: t },
    ),
    db.HardwareBrands.update(
      { brand, model },
      { where: { hardware_id: id }, transaction: t },
    ),

    db.TabletDetails.update(
      {
        screening_size,
        imei_no,
        storage,
        operating_system,
        mac_address_wifi,
        mac_address_bluetooth,
        pen_status,
      },
      { where: { hardware_id: id }, transaction: t },
    ),
  ]);
}
