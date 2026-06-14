import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class HardwarePurchases extends Model<
  InferAttributes<HardwarePurchases>,
  InferCreationAttributes<HardwarePurchases>
> {
  declare hardware_id: CreationOptional<number>;
  declare purchase_price: CreationOptional<string | null>;
  declare salvage_value: CreationOptional<string | null>;
  declare purchase_date: Date | null;
  declare receive_date: Date | null;
  declare warranty_start: Date | null;
  declare warranty_end: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
HardwarePurchases.init(
  {
    hardware_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchase_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    salvage_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    receive_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    warranty_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    warranty_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "hardware_purchases",
    timestamps: true,
  },
);

export default HardwarePurchases;
