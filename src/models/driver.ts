import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import DriverAttendance from "./driverAttendance";
import ShipmentCost from "./shipmentCost";

class Driver extends Model {
  public id!: number;
  public driver_code!: string;
  public name!: string;

  public readonly ShipmentCosts?: ShipmentCost[];
  public readonly DriverAttendances?: DriverAttendance[];
}

Driver.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    driver_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "drivers",
  }
);

Driver.hasMany(DriverAttendance, {
  foreignKey: "driver_code",
  sourceKey: "driver_code",
});
Driver.hasMany(ShipmentCost, {
  foreignKey: "driver_code",
  sourceKey: "driver_code",
});

ShipmentCost.belongsTo(Driver, {
  foreignKey: "driver_code",
  targetKey: "driver_code",
});
DriverAttendance.belongsTo(Driver, {
  foreignKey: "driver_code",
  targetKey: "driver_code",
});

export default Driver;
