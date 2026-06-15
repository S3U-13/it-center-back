import db from "../../../models/it-center";
import { Transaction } from "sequelize";

export async function EditAllInOne(id: Number, body: any, t: Transaction) {
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
    // accessories
    adaptor,
    adaptor_type,
    mouse,
    keyboard,
    // identifiers
    service_tag,
    express_code,
    main_asset_number,
    // brands
    brand,
    model,
    //monitor
    screening_size,
    resolution,
    monitor_type,
    cpu,
    ram,
    storage_type,
    storage_capacity,
    operating_system,
    gpu,
    gpu_type,
    wifi,
    bluetooth,
    built_in_camera,
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
    db.HardwareAccessories.update(
      { adaptor, adaptor_type, mouse, keyboard },
      { where: { hardware_id: id }, transaction: t },
    ),
    db.HardwareIdentifiers.update(
      { service_tag, express_code, main_asset_number },
      { where: { hardware_id: id }, transaction: t },
    ),
    db.HardwareBrands.update(
      { brand, model },
      { where: { hardware_id: id }, transaction: t },
    ),
    db.MonitorDetails.update(
      { screening_size, resolution, monitor_type },
      { where: { hardware_id: id }, transaction: t },
    ),
    db.ComputerDetails.update(
      {
        cpu,
        ram,
        storage_type,
        storage_capacity,
        operating_system,
        gpu,
        gpu_type,
        wifi,
        bluetooth,
        built_in_camera,
      },
      { where: { hardware_id: id }, transaction: t },
    ),
  ]);
}
