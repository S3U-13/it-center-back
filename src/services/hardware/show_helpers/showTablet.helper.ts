import db from "../../../models/it-center";
import dbPPK from "../../../models/ppkhosp";

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
        include: [
          { model: db.Categories, as: "Brand", attributes: ["id", "name"] },
          { model: db.Categories, as: "Model", attributes: ["id", "name"] },
        ],
      },
      {
        model: db.TabletDetails,
        as: "Tablet",
        include: [
          {
            model: db.Categories,
            as: "ScreeningSizeTablet",
            attributes: ["id", "name"],
          },
          { model: db.Categories, as: "CpuTablet", attributes: ["id", "name"] },
          { model: db.Categories, as: "RamTablet", attributes: ["id", "name"] },
          {
            model: db.Categories,
            as: "StorageTablet",
            attributes: ["id", "name"],
          },
          {
            model: db.Categories,
            as: "OperatingSystemTablet",
            attributes: ["id", "name"],
          },
          {
            model: db.Categories,
            as: "OSVersionTablet",
            attributes: ["id", "name"],
          },
          {
            model: db.Categories,
            as: "PenStatusTablet",
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
    // brands
    brand: data.Brands.brand,
    brand_name: data.Brands.Brand.name,
    model: data.Brands.model,
    model_name: data.Brands.Model.name,
    // tablet
    screening_size: data.Tablet.screening_size,
    screening_size_name: data.Tablet.ScreeningSizeTablet.name,
    imei_no: data.Tablet.imei_no,
    storage: data.Tablet.storage,
    storage_value: data.Tablet.StorageTablet.name,
    operating_system: data.Tablet.operating_system,
    operating_system_name: data.Tablet.OperatingSystemTablet.name,
    os_version: data.Tablet.os_version,
    os_version_name: data.Tablet.OSVersionTablet.name,
    mac_address_wifi: data.Tablet.mac_address_wifi,
    mac_address_bluetooth: data.Tablet.bluetooth,
    pen_status: data.Tablet.pen_status,
    pen_status_name: data.Tablet.PenStatusTablet.name,
  };

  return formatData;
}
