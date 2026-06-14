import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class HardwareLocations extends Model<
  InferAttributes<HardwareLocations>,
  InferCreationAttributes<HardwareLocations>
> {
  declare hardware_id: CreationOptional<number>;
  declare FuncUnitID: CreationOptional<number | null>;
  declare location: CreationOptional<number | null>;
  declare person_in_charge: number | null;
  declare contact_number: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
HardwareLocations.init(
  {
    hardware_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    FuncUnitID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    person_in_charge: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    contact_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "hardware_locations",
    timestamps: true,
  },
);

export default HardwareLocations;
