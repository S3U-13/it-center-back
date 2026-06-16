import db from "../../../models/it-center";

export async function ShowTablet(id: number) {
  const data = await db.Hardware.findOne({
    where: { id },
    include: [
      { model: db.HardwareLocations, as: "Locations" },
      {
        model: db.HardwarePurchases,
        as: "Purchases",
      },
      {
        model: db.HardwareBrands,
        as: "Brands",
      },
      {
        model: db.TabletDetails,
        as: "Tablet",
      },
    ],
  });
  const formatData = {
    // hardware
    id: data.id,
    sn: data.sn,
    rpj_no: data.rpj_no,
    machine_name: data.machine_name,
    note: data.note,
    payer: data.payer,
    pay_date: data.pay_date,
    hardware_type: data.hardware_type,
    dispense_status: data.dispense_status,
    // location
    FuncUnitID: data.Locations.FuncUnitID,
    location: data.Locations.location,
    person_in_charge: data.Locations.person_in_charge,
    contact_number: data.Locations.contact_number,
    // purchase
    purchase_price: data.Purchases.purchase_price,
    salvage_value: data.Purchases.salvage_value,
    purchase_date: data.Purchases.purchase_date,
    receive_date: data.Purchases.receive_date,
    warranty_start: data.warranty_start,
    warranty_end: data.warranty_start,
    // accessories
    // adapter: data.Accessories.adapter,
    // adapter_type: data.Accessories.adapter_type,
    // mouse: data.Accessories.mouse,
    // keyboard: data.Accessories.keyboard,
    // identifiers
    // service_tag: data.Identifiers.service_tag,
    // express_code: data.Identifiers.express_code,
    // main_asset_number: data.main_asset_number,
    // brands
    brand: data.Brands.brand,
    model: data.Brands.model,
    // monitor
    // screening_size: data.Monitor.screening_size,
    // resolution: data.Monitor.resolution,
    // monitor_type: data.Monitor.monitor_type,
    // computer
    // cpu: data.Computers.cpu,
    // ram: data.Computers.ram,
    // storage_type: data.Computers.storage_type,
    // storage_capacity: data.Computers.storage_capacity,
    // operating_system: data.Computers.operating_system,
    // gpu: data.Computers.gpu,
    // gpu_type: data.Computers.gpu_type,
    // wifi: data.Computers.wifi,
    // bluetooth: data.Computers.bluetooth,
    // built_in_camera: data.Computers.built_in_camera,
    // tablet
    screening_size: data.Tablet.screening_size,
    imei_no: data.Tablet.imei_no,
    storage: data.Tablet.storage,
    operating_system: data.Tablet.operating_system,
    mac_address_wifi: data.Tablet.mac_address_wifi,
    mac_address_bluetooth: data.Tablet.bluetooth,
    pen_status: data.Tablet.pen_status,
  };

  return formatData;
}
