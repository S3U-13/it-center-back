import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class AppPerson extends Model<
  InferAttributes<AppPerson>,
  InferCreationAttributes<AppPerson>
> {
  declare id: CreationOptional<number>;
  declare salutation: CreationOptional<number>;
  declare firstname: CreationOptional<string>;
  declare lastname: CreationOptional<string>;
  declare GroID: CreationOptional<number>;
  declare OffID: CreationOptional<number>;
  declare PosID: CreationOptional<number>;
  declare FuncUnitID: CreationOptional<number>;
  declare StatusID: CreationOptional<number>;
  declare active: CreationOptional<string>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
AppPerson.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    salutation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    GroID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OffID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PosID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    FuncUnitID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    StatusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "app_person",
    timestamps: false,
  },
);

export default AppPerson;
