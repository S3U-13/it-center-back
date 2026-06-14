import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class HardwareIdentifiers extends Model<
  InferAttributes<HardwareIdentifiers>,
  InferCreationAttributes<HardwareIdentifiers>
> {
  declare hardware_id: CreationOptional<number>;
  declare service_tag: CreationOptional<string | null>;
  declare express_code: CreationOptional<number | null>;
  declare main_asset_number: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
HardwareIdentifiers.init(
  {
    hardware_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    service_tag: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    express_code: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    main_asset_number: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "hardware_identifiers",
    timestamps: true,
  },
);

export default HardwareIdentifiers;
