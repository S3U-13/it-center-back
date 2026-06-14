import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index"; // ✨ แก้จุดนี้: ให้ดึงอินสแตนซ์มาจากศูนย์กลาง index.ts ในโฟลเดอร์เดียวกัน

// 1. สร้าง Class โดยใช้ InferAttributes เพื่อให้ดึง Type ไปใช้ได้อัตโนมัติ
class ComputerDetails extends Model<
  InferAttributes<ComputerDetails>,
  InferCreationAttributes<ComputerDetails>
> {
  declare hardware_id: CreationOptional<number>;
  // declare screen_size: number | null;
  // declare resolution: number | null;
  // declare monitor_type: number | null;
  declare cpu: number | null;
  declare ram: number | null;
  declare storage_type: number | null;
  declare storage_capacity: number | null;
  declare operating_system: number | null;
  declare gpu: number | null;
  declare gpu_type: number | null;
  declare bluetooth: number | null;
  declare wifi: number | null;
  declare built_in_camera: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 📝 เพิ่มช่องสำหรับทำความสัมพันธ์ (Associations) รองรับระบบใน index.ts v6
  static associate(models: any) {
    // ตัวอย่างการเชื่อมตาราง: User.hasMany(models.Post, { foreignKey: 'userId' });
  }
}

// 2. กำหนดโครงสร้างคอลัมน์ (Schema) ของตาราง
ComputerDetails.init(
  {
    hardware_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // screen_size: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    // resolution: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    // monitor_type: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    cpu: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ram: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    storage_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    storage_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    operating_system: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gpu: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gpu_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bluetooth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wifi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    built_in_camera: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // ใช้ตัวแปรอินสแตนซ์ที่ดึงมาจาก index.ts
    tableName: "computer_details",
    timestamps: true,
  },
);

export default ComputerDetails;
