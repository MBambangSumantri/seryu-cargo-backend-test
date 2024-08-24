import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Driver from "./driver";

class DriverAttendance extends Model {
  public id!: number;
  public driver_code!: string;
  public attendance_date!: string;
  public attendance_status!: boolean;
}

DriverAttendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    driver_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendance_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendance_status: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    tableName: "driver_attendances",
  }
);

export default DriverAttendance;
