import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class Hardware extends Model<
  InferAttributes<Hardware>,
  InferCreationAttributes<Hardware>
> {
  declare id: CreationOptional<number>;
  declare rpj_no: CreationOptional<string>;
  declare sn: CreationOptional<string>;
  declare hardware_type: number | null;
  declare machine_name: string | null;
  declare note: CreationOptional<string>;
  declare payer: Number | null;
  declare pay_date: Date | null;
  declare dispense_status: Number | null;
  declare flag_cancel: String | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
Hardware.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rpj_no: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    sn: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    hardware_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    machine_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    payer: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pay_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dispense_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    flag_cancel: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "N",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "hardware",
    timestamps: true,
  },
);

export default Hardware;
