import db from "../../../models/it-center";
import dbPPK from "../../../models/ppkhosp";

export async function ShowMonitor(id: number) {
  const data = await db.Hardware.findOne({
    where: { id },
    include: [
      { model: db.HardwareLocations, as: "Locations" },
      {
        model: db.HardwarePurchases,
        as: "Purchases",
      },
      {
        model: db.HardwareAccessories,
        as: "Accessories",
        include: [
          {
            model: db.Categories,
            as: "AdapterType",
            attributes: ["id", "name"],
          },
        ],
      },

      {
        model: db.HardwareBrands,
        as: "Brands",
        include: [
          { model: db.Categories, as: "Brand", attributes: ["id", "name"] },
          { model: db.Categories, as: "Model", attributes: ["id", "name"] },
        ],
      },
      {
        model: db.MonitorDetails,
        as: "Monitor",
        include: [
          {
            model: db.Categories,
            as: "ScreeningSizeMonitor",
            attributes: ["id", "name"],
          },
          {
            model: db.Categories,
            as: "ResolutionMonitor",
            attributes: ["id", "name"],
          },
          {
            model: db.Categories,
            as: "MonitorType",
            attributes: ["id", "name"],
          },
        ],
      },
      { model: db.Categories, as: "HardWareType", attributes: ["id", "name"] },
      { model: db.DispenseStatus, attributes: ["id", "name"] },
    ],
  });

  const [location, FuncUnitID] = await Promise.all([
    dbPPK.Location.findOne({ where: { id: data.Locations.location } }),
    dbPPK.FuncUnit.findOne({
      where: { FuncunitID: data.Locations.FuncUnitID },
    }),
  ]);
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
    hardware_type_name: data.HardWareType.name,
    dispense_status: data.dispense_status,
    dispense_status_name: data.DispenseStatus.name,
    // location
    FuncUnitID: data.Locations.FuncUnitID,
    FuncUnitName: FuncUnitID.FuncunitName,
    location: data.Locations.location,
    location_name: location.detailtext,
    person_in_charge: data.Locations.person_in_charge,
    contact_number: data.Locations.contact_number,
    // purchase
    purchase_price: data.Purchases.purchase_price,
    salvage_value: data.Purchases.salvage_value,
    purchase_date: data.Purchases.purchase_date,
    receive_date: data.Purchases.receive_date,
    warranty_start: data.Purchases.warranty_start,
    warranty_end: data.Purchases.warranty_start,
    // accessories
    adapter: data.Accessories.adapter,
    adapter_type: data.Accessories.adapter_type,
    adapter_type_name: data.Accessories.AdapterType.name,
    // mouse: data.Accessories.mouse,
    // keyboard: data.Accessories.keyboard,
    // brands
    brand: data.Brands.brand,
    brand_name: data.Brands.Brand.name,
    model: data.Brands.model,
    model_name: data.Brands.Model.name,
    // monitor
    screening_size: data.Monitor.screening_size,
    screening_size_name: data.Monitor.ScreeningSizeMonitor.name,
    resolution: data.Monitor.resolution,
    resolution_name: data.Monitor.ResolutionMonitor.name,
    monitor_type: data.Monitor.monitor_type,
    monitor_type_name: data.Monitor.MonitorType.name,
  };

  return formatData;
}
