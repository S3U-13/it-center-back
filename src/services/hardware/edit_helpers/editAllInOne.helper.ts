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

  await db.HardwareLocations.update(
    {
      FuncUnitID: FuncUnitID,
      location: location,
      person_in_charge: person_in_charge,
      contact_number: contact_number,
    },
    { where: { hardware_id: id } },
    { transaction: t },
  );
  await db.HardwarePurchases.update(
    {
      purchase_price: purchase_price,
      salvage_value: salvage_value,
      purchase_date: purchase_date,
      receive_date: receive_date,
      warranty_start: warranty_start,
      warranty_end: warranty_end,
    },
    { where: { hardware_id: id } },
    { transaction: t },
  );
  await db.HardwareAccessories.update(
    {
      adaptor: adaptor,
      adaptor_type: adaptor_type,
      mouse: mouse,
      keyboard: keyboard,
    },
    { where: { hardware_id: id } },
    { transaction: t },
  );
  await db.HardwareIdentifiers.update(
    {
      service_tag: service_tag,
      express_code: express_code,
      main_asset_number: main_asset_number,
    },
    { where: { hardware_id: id } },
    { transaction: t },
  );
  await db.HardwareBrands.update(
    {
      brand: brand,
      model: model,
    },
    { where: { hardware_id: id } },
    { transaction: t },
  );
  await db.MonitorDetails.update(
    {
      screening_size: screening_size,
      resolution: resolution,
      monitor_type: monitor_type,
    },
    { where: { hardware_id: id } },
    { transaction: t },
  );
  await db.ComputerDetails.update(
    {
      cpu: cpu,
      ram: ram,
      storage_type: storage_type,
      storage_capacity: storage_capacity,
      operating_system: operating_system,
      gpu: gpu,
      gpu_type: gpu_type,
      wifi: wifi,
      bluetooth: bluetooth,
      built_in_camera: built_in_camera,
    },
    { where: { hardware_id: id } },
    { transaction: t },
  );
}
