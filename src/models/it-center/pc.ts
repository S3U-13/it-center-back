import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class Pc extends Model<InferAttributes<Pc>, InferCreationAttributes<Pc>> {
  declare id: CreationOptional<number>;
  declare sn: CreationOptional<string>;
  declare rpj_no: CreationOptional<string>;
  declare purchase_price: string | null;
  declare salvage_value: string | null;
  declare purchase_date: Date | null;
  declare receive_date: Date | null;
  declare warranty_start: Date | null;
  declare warranty_end: Date | null;
  declare note: CreationOptional<string>;
  declare keyboard: CreationOptional<string>;
  declare mouse: CreationOptional<string>;
  declare adapter: string | null;
  declare adapterType: string | null;
  declare machineName: string | null;
  declare FuncUnitID: number | null;
  declare location: number | null;
  declare payer: number | null;
  declare pay_date: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
Pc.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sn: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    rpj_no: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    purchase_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    salvage_value: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
      allowNull: true,
    },

    purchase_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    receive_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    warranty_start: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    warranty_end: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    keyboard: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    mouse: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    adapter: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    adapterType: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    machineName: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    FuncUnitID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.INTEGER,
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "pc",
    timestamps: true,
  },
);

export default Pc;
