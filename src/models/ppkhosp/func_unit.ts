import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class FuncUnit extends Model<
  InferAttributes<FuncUnit>,
  InferCreationAttributes<FuncUnit>
> {
  declare FuncUnitID: CreationOptional<number>;
  declare FuncUnitName: CreationOptional<string>;
  declare active: CreationOptional<string>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
FuncUnit.init(
  {
    FuncUnitID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    FuncUnitName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "app_personfunctionalunit",
    timestamps: false,
  },
);

export default FuncUnit;
