import db from "../../../models/it-center";
import { Transaction } from "sequelize";

export async function EditPrinter(id: Number, body: any, t: Transaction) {
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
    // printer
    printer_type,
    connection,
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
    db.HardwarePrinterDetails.update(
      {
        printer_type,
        connection,
      },
      { where: { hardware_id: id }, transaction: t },
    ),
  ]);
}
