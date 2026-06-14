import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class HardwareAccessories extends Model<
  InferAttributes<HardwareAccessories>,
  InferCreationAttributes<HardwareAccessories>
> {
  declare hardware_id: CreationOptional<number>;
  declare adapter: CreationOptional<string | null>;
  declare adapter_type: CreationOptional<number | null>;
  declare mouse: string | null;
  declare keyboard: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
HardwareAccessories.init(
  {
    hardware_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adapter: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    adapter_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mouse: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    keyboard: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "hardware_accessories",
    timestamps: true,
  },
);

export default HardwareAccessories;
