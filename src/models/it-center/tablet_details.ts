import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class TabletDetails extends Model<
  InferAttributes<TabletDetails>,
  InferCreationAttributes<TabletDetails>
> {
  declare hardware_id: CreationOptional<number>;
  declare screening_size: CreationOptional<number | null>;
  declare imei_no: CreationOptional<number | null>;
  declare storage: CreationOptional<number | null>;
  declare operating_system: CreationOptional<number | null>;
  declare mac_address_wifi: CreationOptional<string | null>;
  declare mac_address_bluetooth: CreationOptional<string | null>;
  declare pen_status: CreationOptional<number | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
TabletDetails.init(
  {
    hardware_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    screening_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imei_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    storage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    operating_system: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mac_address_wifi: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mac_address_bluetooth: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    pen_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "tablet_details",
    timestamps: true,
  },
);

export default TabletDetails;
