import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class UPSDetails extends Model<
  InferAttributes<UPSDetails>,
  InferCreationAttributes<UPSDetails>
> {
  declare hardware_id: CreationOptional<number>;
  declare ups_type: CreationOptional<number | null>;
  declare battery_capacity: CreationOptional<number | null>;
  declare battery_quantity: CreationOptional<number | null>;
  declare installation_date: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
UPSDetails.init(
  {
    hardware_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ups_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    battery_capacity: {
      // ความจุ
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    battery_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    installation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "ups_details",
    timestamps: true,
  },
);

export default UPSDetails;
