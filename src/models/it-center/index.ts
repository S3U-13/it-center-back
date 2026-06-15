"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize"; // เปลี่ยนมาใช้ sequelize package หลักของ v6

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// 1. ดึงค่า Config
const rawConfig = require(
  path.resolve(__dirname, "..", "..", "config", "config-itppk"),
);
const config = rawConfig.default ? rawConfig.default[env] : rawConfig[env];

// 2. สร้างอินสแตนซ์ Sequelize v6 ก่อน
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect || "mysql", // ระบุเป็น string เช่น 'mysql', 'postgres'
    port: Number(config.port) || 3306,
    logging: config.logging !== false ? console.log : false,
  },
);

// สร้าง object เปล่าแบบยังไม่ระบุเจาะจงชนิดในช่วงแรก
const db: any = {};

// 3. ค้นหาและโหลดคลาสโมเดลทั้งหมดในโฟลเดอร์นี้แบบอัตโนมัติ
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".js" || file.slice(-3) === ".ts") &&
      file.indexOf(".test.js") === -1 &&
      file.indexOf(".test.ts") === -1 &&
      file !== "db.d.ts" // ป้องกันการโหลดไฟล์ Type Definition
    );
  })
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, file));
    // รองรับทั้ง export default และ export ปกติ
    let model = modelModule.default || modelModule;

    // ระบบ v6 มักใช้โครงสร้างฟังก์ชันข้ามไฟล์ (โมเดลแบบเก่า) หรือคลาสที่เขียนแบบใช้สืบทอด
    if (typeof model === "function" && model.init) {
      // สำหรับคลาสโมเดล v6 ที่เขียนสืบทอดมาจาก Model และมีเมธอด init ไว้เรียกใช้งาน
      // ในกรณีนี้โมเดลมักถูกอินิทโครงสร้างแยกในไฟล์ตัวเองแล้ว เราจับยัดเข้า db object ได้เลย
      db[model.name] = model;
    } else if (typeof model === "function") {
      // สำหรับสไตล์ดั้งเดิมของ Sequelize CLI ที่ส่งฟังก์ชันมาให้รันอินิท
      model = model(sequelize, DataTypes);
      db[model.name] = model;
    } else if (model && typeof model === "object") {
      // เก็บตกกรณีที่มีการนำคลาสใส่ไว้ใน object ตัวแปรย่อย
      const actualModel = Object.values(model)[0];
      if (typeof actualModel === "function" && (actualModel as any).init) {
        db[(actualModel as any).name] = actualModel;
      }
    }
  });

// 4. เรียกใช้การเชื่อมความสัมพันธ์ (Associations) หากตัวโมเดลมีฟังก์ชัน associate ตั้งไว้
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// hardware has many =========================

db.Hardware.hasOne(db.HardwareAccessories, {
  foreignKey: "hardware_id",
  as: "Accessories",
});
db.Hardware.hasOne(db.HardwarePurchases, {
  foreignKey: "hardware_id",
  as: "Purchases",
});
db.Hardware.hasOne(db.HardwareLocations, {
  foreignKey: "hardware_id",
  as: "Locations",
});
db.Hardware.hasOne(db.HardwareIdentifiers, {
  foreignKey: "hardware_id",
  as: "Identifiers",
});

db.Hardware.hasOne(db.ComputerDetails, {
  foreignKey: "hardware_id",
  as: "Computers",
});
db.Hardware.hasOne(db.PrinterDetails, {
  foreignKey: "hardware_id",
  as: "Printer",
});
db.Hardware.hasOne(db.TabletDetails, {
  foreignKey: "hardware_id",
  as: "Tablet",
});
db.Hardware.hasOne(db.HardwareBrands, {
  foreignKey: "hardware_id",
  as: "Brands",
});
db.Hardware.hasOne(db.MonitorDetails, {
  foreignKey: "hardware_id",
  as: "Monitor",
});

// // =============== categories_type ============== //
db.CategoriesTypes.hasMany(db.Categories, {
  foreignKey: "type_id",
  as: "Categories",
});

// // ===========================================
// // =============== belong to ==================

db.HardwareAccessories.belongsTo(db.Hardware, {
  foreignKey: "hardware_id",
});
db.HardwarePurchases.belongsTo(db.Hardware, {
  foreignKey: "hardware_id",
});
db.HardwareLocations.belongsTo(db.Hardware, {
  foreignKey: "hardware_id",
});
db.HardwareIdentifiers.belongsTo(db.Hardware, {
  foreignKey: "hardware_id",
});
db.ComputerDetails.belongsTo(db.Hardware, {
  foreignKey: "hardware_id",
});
db.PrinterDetails.belongsTo(db.Hardware, {
  foreignKey: "hardware_id",
});
db.TabletDetails.belongsTo(db.Hardware, {
  foreignKey: "hardware_id",
});

// // ================= categories ==================
db.Categories.belongsTo(db.CategoriesTypes, {
  foreignKey: "type_id",
  as: "CategoriesTypes",
});

// // ====================== hardware brands ====================== //
db.HardwareBrands.belongsTo(db.Categories, {
  foreignKey: "brand",
  as: "Brand",
});

db.HardwareBrands.belongsTo(db.Categories, {
  foreignKey: "model",
  as: "Model",
});

// // =============== choice computer to categories =============== //
db.Hardware.belongsTo(db.Categories, {
  foreignKey: "hardware_type",
  as: "HardWareType",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "screening_size",
  as: "ScreeningSizeComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "resolution",
  as: "ResolutionComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "monitor_type",
  as: "MonitorTypeComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "cpu",
  as: "CpuComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "ram",
  as: "RamComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "storage_type",
  as: "StorageTypeComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "storage_capacity",
  as: "StorageCapacityComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "operating_system",
  as: "OperatingSystemComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "gpu",
  as: "GpuComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "gpu_type",
  as: "GpuTypeComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "wifi",
  as: "WifiComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "bluetooth",
  as: "BluetoothComputer",
});
db.ComputerDetails.belongsTo(db.Categories, {
  foreignKey: "built_in_camera",
  as: "BuiltInCameraComputer",
});

// // ===================== printer ===================== //
db.PrinterDetails.belongsTo(db.Categories, {
  foreignKey: "printer_type",
  as: "PrinterType",
});
db.PrinterDetails.belongsTo(db.Categories, {
  foreignKey: "connection",
  as: "Connection",
});

// // ===================== tablet ===================== //
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "screen_size",
  as: "ScreenSizeTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "resolution",
  as: "ResolutionTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "monitor_type",
  as: "MonitorTypeTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "cpu",
  as: "CpuTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "ram",
  as: "RamTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "storage_type",
  as: "StorageTypeTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "storage_capacity",
  as: "StorageCapacityTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "operating_system",
  as: "OperatingSystemTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "gpu",
  as: "GpuTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "gpu_type",
  as: "GpuTypeTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "wifi",
  as: "WifiTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "bluetooth",
  as: "BluetoothTablet",
});
db.TabletDetails.belongsTo(db.Categories, {
  foreignKey: "bluetooth",
  as: "BuiltInCameraTablet",
});

db.Hardware.belongsTo(db.DispenseStatus, {
  foreignKey: "dispense_status",
});

// =================== monitor detail ==================== //
db.MonitorDetails.belongsTo(db.Categories, {
  foreignKey: "screening_size",
  as: "ScreeningSizeMonitor",
});
db.MonitorDetails.belongsTo(db.Categories, {
  foreignKey: "resolution",
  as: "ResolutionMonitor",
});
db.MonitorDetails.belongsTo(db.Categories, {
  foreignKey: "monitor_type",
  as: "MonitorType",
});

// 5. ส่งออกระบบไปใช้ร่วมกัน
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize, Sequelize };
export default db;
