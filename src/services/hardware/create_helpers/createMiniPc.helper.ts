import db from "../../../models/it-center/index";
import { Transaction } from "sequelize";
export async function CreateMiniPc(
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
    purchase_price: i.purchase,
    salvage_value: i.salvage_value,
    purchase_date: i.purchase_date || null,
    receive_date: i.receive_date || null,
    warranty_start: i.warranty_start || null,
    warranty_end: i.warranty_end || null,
  }));

  const mapAccessories = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    adapter: i.adapter,
    adapter_type: i.adapter_type,
    mouse: i.mouse,
    keyboard: i.keyboard,
  }));

  const mapBrands = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    brand: i.brand,
    model: i.model,
  }));

  const mapMonitorDetails = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    screening_size: i.screening_size,
    resolution: i.resolution,
    monitor_type: i.monitor_type,
  }));

  const mapComputerDetails = array_data.map((i: any, index: number) => ({
    hardware_id: hardware[index].id,
    cpu: i.cpu,
    ram: i.ram,
    storage_type: i.storage_type,
    storage_capacity: i.storage.capacity,
    operating_system: i.operating_system,
    gpu: i.gpu,
    gpu_type: i.gpu_type,
    wifi: i.wifi,
    bluetooth: i.bluetooth,
    built_in_camera: i.built_in_camera,
  }));

  // 🟢 แก้ไขตรงนี้: เปลี่ยนจาก { t } เป็น { transaction: t }
  return await Promise.all([
    db.HardwareLocations.bulkCreate(mapLocation, { transaction: t }),
    db.HardwarePurchases.bulkCreate(mapPurchase, { transaction: t }),
    db.HardwareAccessories.bulkCreate(mapAccessories, { transaction: t }),
    db.HardwareBrands.bulkCreate(mapBrands, { transaction: t }),
    db.HardwareMonitorDetails.bulkCreate(mapMonitorDetails, { transaction: t }),
    db.HardwareComputerDetails.bulkCreate(mapComputerDetails, {
      transaction: t,
    }),
  ]);
}
